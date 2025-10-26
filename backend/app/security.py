from __future__ import annotations

from datetime import datetime, timedelta
from typing import Optional, Dict, Any

from passlib.context import CryptContext
from jose import jwt, JWTError

from app.core.config import settings

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
ALGORITHM = "HS256"


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
    data: Dict[str, Any], expires_delta: Optional[timedelta] = None
) -> str:
    to_encode = data.copy()
    now = datetime.utcnow()
    if expires_delta is None:
        expire = now + timedelta(minutes=30)
    else:
        expire = now + expires_delta
    to_encode.update({"exp": expire, "iat": now})
    secret = settings.JWT_SECRET_KEY
    if not secret:
        raise RuntimeError("JWT_SECRET_KEY is not set in settings")
    encoded_jwt = jwt.encode(to_encode, secret, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise


__all__ = [
    "get_password_hash",
    "verify_password",
    "create_access_token",
    "decode_access_token",
]
