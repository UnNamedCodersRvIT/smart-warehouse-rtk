from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from datetime import datetime
import os, uuid


from app.db.session import get_session
from app.db.models import Robot


router = APIRouter(prefix="/api/robots")
ROBOT_TOKEN = os.getenv("ROBOT_TOKEN", "robot_token")

class RobotData(BaseModel):
    robot_id: str
    timestamp: datetime
    location: Dict[str, Any]
    scan_results: Dict[str, Any]
    battery_level: int


@router.post("/data")
def receive_robot_data(
    data: RobotData,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_session)
):
    # --- Проверка токена ---
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    token = authorization.split(" ")[1]
    if token != ROBOT_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid robot token")

    # --- Поиск робота в базе ---
    robot = db.query(Robot).filter(Robot.id == data.robot_id).first()
    if not robot:
        raise HTTPException(status_code=404, detail=f"Robot {data.robot_id} not found")

    # --- Обновление данных ---
    robot.battery_level = data.battery_level
    robot.last_update = data.timestamp

    # Проверяем наличие данных о местоположении
    robot.current_zone = data.location.get("zone")
    robot.current_row = data.location.get("row")
    robot.current_shelf = data.location.get("shelf")

    db.commit()

    message_id = str(uuid.uuid4())

    return {
        "status": "received",
        "message_id": message_id
    }
