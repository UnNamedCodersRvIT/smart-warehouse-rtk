from __future__ import annotations

from pydantic import BaseModel
from typing import Dict, Any
from datetime import datetime


class RobotData(BaseModel):
    robot_id: str
    timestamp: datetime
    location: RobotDataLocation
    scan_results: list[Dict[str, Any]]
    battery_level: float


class RobotDataLocation(BaseModel):
    zone: str
    row: int
    shelf: int
