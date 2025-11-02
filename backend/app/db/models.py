from __future__ import annotations

from datetime import datetime, date
from typing import Optional

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    DECIMAL,
    Date,
    func,
    Index,
)
from sqlalchemy.orm import relationship

from .base import Base


class User(Base):
    __tablename__ = "users"

    id: int = Column(Integer, primary_key=True)
    email: str = Column(String(255), unique=True, nullable=False)
    password_hash: str = Column(String(255), nullable=False)
    name: str = Column(String(255), nullable=False)
    role: str = Column(String(50), nullable=False)
    created_at: datetime = Column(DateTime(timezone=False), server_default=func.now())


class Robot(Base):
    __tablename__ = "robots"

    id: str = Column(String(50), primary_key=True)
    status: str = Column(String(50), nullable=True, server_default="active")
    battery_level: Optional[int] = Column(Integer, nullable=True)
    last_update: Optional[datetime] = Column(DateTime, nullable=True)
    current_zone: Optional[str] = Column(String(10), nullable=True)
    current_row: Optional[int] = Column(Integer, nullable=True)
    current_shelf: Optional[int] = Column(Integer, nullable=True)

    inventory_history = relationship("InventoryHistory", back_populates="robot")


class Product(Base):
    __tablename__ = "products"

    id: str = Column(String(50), primary_key=True)
    name: str = Column(String(255), nullable=False)
    category: Optional[str] = Column(String(100), nullable=True)
    min_stock: int = Column(Integer, nullable=False, server_default="10")
    optimal_stock: int = Column(Integer, nullable=False, server_default="100")

    inventory_history = relationship("InventoryHistory", back_populates="product")
    ai_predictions = relationship("AIPrediction", back_populates="product")


class InventoryHistory(Base):
    __tablename__ = "inventory_history"

    id: int = Column(Integer, primary_key=True)
    robot_id: Optional[str] = Column(String(50), ForeignKey("robots.id"), nullable=True)
    product_id: Optional[str] = Column(
        String(50), ForeignKey("products.id"), nullable=True
    )
    quantity: int = Column(Integer, nullable=False)
    zone: str = Column(String(10), nullable=False)
    row_number: Optional[int] = Column(Integer, nullable=True)
    shelf_number: Optional[int] = Column(Integer, nullable=True)
    status: Optional[str] = Column(String(50), nullable=True)
    scanned_at: datetime = Column(DateTime, nullable=False)
    created_at: datetime = Column(DateTime, server_default=func.now())

    robot = relationship("Robot", back_populates="inventory_history")
    product = relationship("Product", back_populates="inventory_history")

    __table_args__ = (
        Index("idx_inventory_scanned", scanned_at.desc()),
        Index("idx_inventory_product", "product_id"),
        Index("idx_inventory_zone", "zone"),
    )


class AIPrediction(Base):
    __tablename__ = "ai_predictions"

    id: int = Column(Integer, primary_key=True)
    product_id: Optional[str] = Column(
        String(50), ForeignKey("products.id"), nullable=True
    )
    prediction_date: date = Column(Date, nullable=False)
    days_until_stockout: Optional[int] = Column(Integer, nullable=True)
    recommended_order: Optional[int] = Column(Integer, nullable=True)
    confidence_score: Optional[DECIMAL] = Column(DECIMAL(3, 2), nullable=True)
    created_at: datetime = Column(DateTime, server_default=func.now())

    product = relationship("Product", back_populates="ai_predictions")


__all__ = [
    "User",
    "Robot",
    "Product",
    "InventoryHistory",
    "AIPrediction",
]
