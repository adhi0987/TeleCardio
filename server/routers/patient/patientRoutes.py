# routes used in the patient page 
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.patient import patientSchemas
from services.patientServices import patientServices
from core.dependencies import get_current_user
from models.coreModels import User
from models.patient import patientModels

router = APIRouter(
    prefix="/api/patient",
    tags=["Patient"]
)

@router.post("/auth/send-otp", status_code=status.HTTP_200_OK)
def send_otp(request: patientSchemas.SendOTPRequest, db: Session = Depends(get_db)):
    if request.role != "PATIENT":
        raise HTTPException(status_code=400, detail="Invalid role for this endpoint.")
    
    return patientServices.request_patient_otp(db=db, email=request.email)

@router.post("/auth/verify-otp", status_code=status.HTTP_200_OK)
def verify_otp(request: patientSchemas.VerifyOTPRequest, db: Session = Depends(get_db)):
    return patientServices.verify_patient_otp(db=db, email=request.email, otp_code=request.otp_code)

@router.post("/profile/complete", response_model=patientSchemas.PatientResponse, status_code=status.HTTP_201_CREATED)
def complete_profile(
    profile_data: patientSchemas.PatientCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.value != "PATIENT":
        raise HTTPException(status_code=403, detail="Not authorized as a patient.")
        
    return patientServices.complete_patient_profile(db=db, user_id=current_user.id, profile_data=profile_data)

@router.get("/me", response_model=patientSchemas.PatientResponse)
def get_my_patient_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current patient's profile"""
    if current_user.role.value != "PATIENT":
        raise HTTPException(status_code=403, detail="Not authorized as a patient.")
    
    patient = db.query(patientModels.Patient).filter(patientModels.Patient.user_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found.")
    
    return patient

