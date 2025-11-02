from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
import uuid

from app.db.session import get_session
from app.db.models import Robot
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
