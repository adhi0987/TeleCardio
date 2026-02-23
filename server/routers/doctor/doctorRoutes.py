# routes used in the doctor page 
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.patient.patientSchemas import SendOTPRequest, VerifyOTPRequest # Reusing auth schemas
from schemas.doctor import doctorSchemas
from services.doctorServices import doctorServices
from core.dependencies import get_current_user
from models.coreModels import User
from models.doctor import doctorModels
from typing import List

router = APIRouter(prefix="/api/doctor", tags=["Doctor Auth & Profile"])

@router.post("/auth/send-otp")
def send_otp(request: SendOTPRequest, db: Session = Depends(get_db)):
    if request.role != "DOCTOR":
        raise HTTPException(status_code=400, detail="Invalid role.")
    return doctorServices.request_doctor_otp(db=db, email=request.email)

@router.post("/auth/verify-otp")
def verify_otp(request: VerifyOTPRequest, db: Session = Depends(get_db)):
    return doctorServices.verify_doctor_otp(db=db, email=request.email, otp_code=request.otp_code)

@router.post("/profile/complete", response_model=doctorSchemas.DoctorResponse)
def complete_profile(
    profile_data: doctorSchemas.DoctorCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "DOCTOR":
        raise HTTPException(status_code=403, detail="Not authorized as a doctor.")
    return doctorServices.complete_doctor_profile(db=db, user_id=current_user.id, profile_data=profile_data)

from typing import List
# from schemas.doctor.doctorSchemas import DoctorListResponse

@router.get("/list", response_model=List[doctorSchemas.DoctorListResponse ])
def get_all_doctors(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # from models.doctor.doctorModels import Doctor # Local import to avoid circular dependency
    doctors = db.query(doctorModels.Doctor).all()
    return doctors