# routes used in the admin page 

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.admin import adminSchemas
from services.adminServices import adminServices
from models.coreModels import User
from models.patient.patientModels import Patient
from models.doctor.doctorModels import Doctor

router = APIRouter(prefix="/api/admin", tags=["Admin Auth"])

@router.post("/auth/register", response_model=adminSchemas.AdminResponse)
def register_admin(request: adminSchemas.AdminCreate, db: Session = Depends(get_db)):
    # Note: In production, you might want to secure this endpoint so random people can't register as admins!
    return adminServices.create_admin_user(db=db, admin_data=request)

@router.post("/auth/login")
def login_admin(request: adminSchemas.AdminLogin, db: Session = Depends(get_db)):
    return adminServices.authenticate_admin(db=db, login_data=request)

# ==================== User Management ====================

@router.get("/users")
def get_all_users(db: Session = Depends(get_db)):
    """Get all users with their profiles"""
    users = db.query(User).all()
    
    result = []
    for user in users:
        user_info = {
            "id": str(user.id),
            "email": user.email,
            "role": user.role.value,
            "is_verified": user.is_verified,
            "has_filled_profile": user.has_filled_profile,
            "created_at": user.created_at.isoformat() if user.created_at else None,
            "name": None,
            "profile_id": None
        }
        
        # Get profile info
        if user.role.value == "PATIENT":
            patient = db.query(Patient).filter(Patient.user_id == user.id).first()
            if patient:
                user_info["name"] = patient.name
                user_info["profile_id"] = str(patient.id)
        elif user.role.value == "DOCTOR":
            doctor = db.query(Doctor).filter(Doctor.user_id == user.id).first()
            if doctor:
                user_info["name"] = doctor.name
                user_info["profile_id"] = str(doctor.id)
        
        result.append(user_info)
    
    return result

@router.delete("/users/{user_id}")
def delete_user(user_id: str, db: Session = Depends(get_db)):
    """Delete a user and their profile"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Delete the user (cascades to delete profile)
    db.delete(user)
    db.commit()
    
    return {"message": "User deleted successfully"}

@router.post("/users/{user_id}/reset-password")
def reset_user_password(user_id: str, new_password: str, db: Session = Depends(get_db)):
    """Reset a user's password"""
    # This would require implementing password reset logic
    # For now, we'll just return a message
    return {"message": "Password reset functionality needs to be implemented"}
