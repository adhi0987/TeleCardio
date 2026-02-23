# routes used in the admin page 

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.admin import adminSchemas
from services.adminServices import adminServices

router = APIRouter(prefix="/api/admin", tags=["Admin Auth"])

@router.post("/auth/register", response_model=adminSchemas.AdminResponse)
def register_admin(request: adminSchemas.AdminCreate, db: Session = Depends(get_db)):
    # Note: In production, you might want to secure this endpoint so random people can't register as admins!
    return adminServices.create_admin_user(db=db, admin_data=request)

@router.post("/auth/login")
def login_admin(request: adminSchemas.AdminLogin, db: Session = Depends(get_db)):
    return adminServices.authenticate_admin(db=db, login_data=request)