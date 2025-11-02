from __future__ import annotations

from pydantic import BaseModel
from datetime import datetime


class RobotData(BaseModel):
    robot_id: str
    timestamp: datetime
    location: RobotDataLocation
    scan_results: list[RobotScanResult]
    battery_level: float


class RobotDataLocation(BaseModel):
    zone: str
    row: int
    shelf: int


class RobotScanResult(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    status: str
