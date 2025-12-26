from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.schemas.user import UserResponse

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserResponse)
def get_profile(user=Depends(get_current_user)):
    return user

@router.put("/me")
def update_profile(
    full_name: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    user.full_name = full_name
    db.commit()
    return {"message": "Profile updated"}
