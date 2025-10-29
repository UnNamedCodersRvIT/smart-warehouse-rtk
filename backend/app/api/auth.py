from fastapi import APIRouter, Depends, HTTPException, status

from app.db.session import get_session
from sqlalchemy.orm import Session
from app.db.models import User

from app.security import (
    verify_password,
    create_access_token,
    get_password_hash,
)
from app.schemas.auth import LoginRequest, TokenResponse, TokenUser
from app.api.deps import get_current_user

router = APIRouter(prefix="/api/auth")


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_session)):
    """Проверка данных, возврат JWT и информации о пользователе."""
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    token = create_access_token(
        {"sub": str(user.id), "role": user.role, "name": user.name}
    )
    return TokenResponse(token=token, user=TokenUser.model_validate(user))


@router.post("/check", response_model=TokenUser)
def check(user: User = Depends(get_current_user)):
    """DEBUG: Проверка валидности токена и получение информации о пользователе."""
    return TokenUser.model_validate(user)


@router.post("/create_root")
def create_root(db: Session = Depends(get_session)):
    """DEBUG: Создание root."""
    existing_root = db.query(User).filter(User.email == "root@example.com").first()
    if existing_root:
        return {"message": "Root user already exists."}

    root_user = User(
        email="root@example.com",
        password_hash=get_password_hash("root"),
        name="root",
        role="admin",
    )
    db.add(root_user)
    db.commit()
    db.refresh(root_user)
    return {"message": "Root user created successfully.", "user_id": root_user.id}
