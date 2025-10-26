from fastapi import APIRouter

router = APIRouter(prefix="/api")


@router.get("/hello")
def hello():
    """Минимальный endpoint для проверки работоспособности API."""
    return {"message": "Hello, world!"}
