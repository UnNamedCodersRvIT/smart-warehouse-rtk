from __future__ import annotations

from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenUser(BaseModel):
    id: int
    name: str
    role: str

    class Config:
        orm_mode = True


class TokenResponse(BaseModel):
    token: str
    user: TokenUser
