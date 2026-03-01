# routes used in the doctor page 
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.doctor import doctorSchemas
from core.dependencies import get_current_user
from models.coreModels import User
from models.doctor import doctorModels
from typing import List

router = APIRouter(prefix="/api/doctor", tags=["Doctor"])

@router.get("/list", response_model=List[doctorSchemas.DoctorListResponse])
def get_all_doctors(db: Session = Depends(get_db)):
    """Get list of all doctors - public endpoint"""
    doctors = db.query(doctorModels.Doctor).all()
    return doctors

@router.get("/me", response_model=doctorSchemas.DoctorResponse)
def get_my_doctor_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current doctor's profile"""
    if current_user.role.value != "DOCTOR":
        raise HTTPException(status_code=403, detail="Not authorized as a doctor.")
    
    doctor = db.query(doctorModels.Doctor).filter(doctorModels.Doctor.user_id == current_user.id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile not found.")
    
    return doctor

