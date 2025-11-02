from pydantic import BaseModel
from datetime import datetime


class InventoryHistoryItem(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    status: str
    scanned_at: datetime
    robot_id: str | None
    zone: str
    row_number: int | None
    shelf_number: int | None

    class Config:
        from_attributes = True


class InventoryHistoryListResponse(BaseModel):
    total: int
    items: list[InventoryHistoryItem]
    pagination: dict
