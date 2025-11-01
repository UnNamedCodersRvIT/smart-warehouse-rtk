from fastapi import APIRouter, Depends, HTTPException, status

from app.db.session import get_session
from sqlalchemy.orm import Session
from app.db.models import User

from app.api.deps import get_current_user

router = APIRouter(prefix="/api/inventory")

@router.post("/import")
def import_csv(db: Session = Depends(get_session), user: User = Depends(get_current_user)):
    pass
