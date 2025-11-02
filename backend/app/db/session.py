from __future__ import annotations

from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL, future=True)
SessionLocal = sessionmaker(
    bind=engine, autoflush=False, expire_on_commit=False, class_=Session
)


def get_session() -> Generator[Session, None, None]:
    """Dependency для FastAPI: выдаёт сессию и корректно закрывает её."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
