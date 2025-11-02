from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from app.db.base import Base


def test_create_all_tables_in_memory():
    """Быстрая проверка: импорт моделей и создание схемы в sqlite:///:memory:"""
    engine: Engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)

    # простая проверка — в metadata должны присутствовать ожидаемые таблицы
    tables = set(Base.metadata.tables.keys())
    expected = {
        "users",
        "robots",
        "products",
        "inventory_history",
        "ai_predictions",
    }
    assert expected.issubset(tables)
