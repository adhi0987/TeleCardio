# services for the doctors

from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.coreModels import User, UserRole, Otp
from models.doctor.doctorModels import Doctor
from schemas.doctor.doctorSchemas import DoctorCreate
from services.patientServices.patientServices import generate_numeric_otp
from utils.email import send_otp_email
from core.security import create_access_token

def request_doctor_otp(db: Session, email: str):
    # Check if user exists. If not, create placeholder.
    user = db.query(User).filter(User.email == email, User.role == UserRole.DOCTOR).first()
    
    if not user:
        user = User(email=email, role=UserRole.DOCTOR, is_verified=False)
        db.add(user)
        db.commit()
        db.refresh(user)

    otp_code = generate_numeric_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=5)

    new_otp = Otp(email=email, otp_code=otp_code, expires_at=expires_at)
    db.add(new_otp)
    db.commit()

    send_otp_email(email=email, otp_code=otp_code, role="DOCTOR")
    return {"message": "OTP sent successfully to your email."}

def verify_doctor_otp(db: Session, email: str, otp_code: str):
    otp_record = db.query(Otp).filter(
        Otp.email == email, Otp.otp_code == otp_code
    ).order_by(Otp.created_at.desc()).first()

    if not otp_record or datetime.utcnow() > otp_record.expires_at:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired OTP.")

    user = db.query(User).filter(User.email == email, User.role == UserRole.DOCTOR).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    user.is_verified = True
    db.commit()

    has_profile = db.query(Doctor).filter(Doctor.user_id == user.id).first() is not None
    access_token = create_access_token(data={"sub": str(user.id), "role": "DOCTOR"})

    return {"access_token": access_token, "token_type": "bearer", "profile_completed": has_profile}

def complete_doctor_profile(db: Session, user_id: str, profile_data: DoctorCreate):
    existing_profile = db.query(Doctor).filter(Doctor.user_id == user_id).first()
    if existing_profile:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Profile already exists.")

    # Check if NMR number is already registered to someone else
    existing_nmr = db.query(Doctor).filter(Doctor.nmr_number == profile_data.nmr_number).first()
    if existing_nmr:
         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This NMR number is already registered.")

    new_doctor = Doctor(
        user_id=user_id,
        name=profile_data.name,
        specialization=profile_data.specialization,
        nmr_number=profile_data.nmr_number
    )
    
    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)
    return new_doctor