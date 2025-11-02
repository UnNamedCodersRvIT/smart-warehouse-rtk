from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
import uuid

from app.db.session import get_session
from app.db.models import Robot, Product, InventoryHistory
from app.schemas.robots import RobotData


router = APIRouter(prefix="/api/robots")


@router.post("/data")
def receive_robot_data(
    data: RobotData,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_session),
):
    # --- Проверка токена ---
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401, detail="Missing or invalid Authorization header"
        )

    token = authorization[7:]
    if not token.startswith("robot_token_"):
        raise HTTPException(status_code=403, detail="Invalid robot token")
    token = token[12:]
    if data.robot_id != token:
        raise HTTPException(status_code=403, detail="Invalid robot token")

    # --- Поиск робота в базе ---
    robot = db.query(Robot).filter(Robot.id == data.robot_id).first()
    if not robot:
        raise HTTPException(status_code=404, detail=f"Robot {data.robot_id} not found")

    # --- Обновление данных ---
    robot.battery_level = data.battery_level
    robot.last_update = data.timestamp
    robot.current_zone = data.location.zone
    robot.current_row = data.location.row
    robot.current_shelf = data.location.shelf
    for scan in data.scan_results:
        product = db.query(Product).filter(Product.id == scan.product_id).first()
        if not product:
            continue
        inv = InventoryHistory(
            robot_id=robot.id,
            product_id=product.id,
            quantity=scan.quantity,
            status=scan.status,
            zone=data.location.zone,
            row_number=data.location.row,
            shelf_number=data.location.shelf,
            scanned_at=data.timestamp,
        )
        db.add(inv)

    db.commit()

    message_id = str(uuid.uuid4())

    return {"status": "received", "message_id": message_id}


@router.post("/add")
def add_robots(
    db: Session = Depends(get_session),
):
    """DEBUG: Добавление 5 роботов в базу данных"""
    for i in range(1, 6):
        r = db.query(Robot).filter(Robot.id == f"RB-{i:03d}").first()
        if r:
            continue
        new_robot = Robot(
            id=f"RB-{i:03d}",
            battery_level=100.0,
            current_zone="A",
            current_row=1,
            current_shelf=1,
        )
        db.add(new_robot)
        db.commit()
    return {"robots": db.query(Robot).all()}


@router.post("/add_products")
def add_products(
    db: Session = Depends(get_session),
):
    """DEBUG: Добавление некоторых продуктов в базу данных"""
    products = [
        {"id": "TEL-4567", "name": "Роутер RT-AC68U"},
        {"id": "TEL-8901", "name": "Модем DSL-2640U"},
        {"id": "TEL-2345", "name": "Коммутатор SG-108"},
        {"id": "TEL-6789", "name": "IP-телефон T46S"},
        {"id": "TEL-3456", "name": "Кабель UTP Cat6"},
    ]
    for prod in products:
        p = db.query(Product).filter(Product.id == prod["id"]).first()
        if p:
            continue
        new_product = Product(
            id=prod["id"],
            name=prod["name"],
        )
        db.add(new_product)
    db.commit()
    return {"products": db.query(Product).all()}
