# services for the patients
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.coreModels import User, UserRole, Otp
from models.patient.patientModels import Patient
from schemas.patient.patientSchemas import PatientCreate
from utils.email import send_otp_email
from core.security import create_access_token

def generate_numeric_otp(length=6) -> str:
    return "".join([str(random.randint(0, 9)) for _ in range(length)])

def request_patient_otp(db: Session, email: str):
    # 1. Check if user exists. If not, create a placeholder verified=False user.
    user = db.query(User).filter(User.email == email, User.role == UserRole.PATIENT).first()
    
    if not user:
        user = User(email=email, role=UserRole.PATIENT, is_verified=False)
        db.add(user)
        db.commit()
        db.refresh(user)

    # 2. Generate OTP and expiry time (5 minutes)
    otp_code = generate_numeric_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=5)

    # 3. Save OTP to database
    new_otp = Otp(email=email, otp_code=otp_code, expires_at=expires_at)
    db.add(new_otp)
    db.commit()

    # 4. Trigger Email (Mock)
    send_otp_email(email=email, otp_code=otp_code, role="PATIENT")

    return {"message": "OTP sent successfully to your email."}


def verify_patient_otp(db: Session, email: str, otp_code: str):
    # 1. Find the latest OTP for this email
    otp_record = db.query(Otp).filter(
        Otp.email == email,
        Otp.otp_code == otp_code
    ).order_by(Otp.created_at.desc()).first()

    if not otp_record:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP.")

    if datetime.utcnow() > otp_record.expires_at:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP has expired.")

    # 2. Mark user as verified
    user = db.query(User).filter(User.email == email, User.role == UserRole.PATIENT).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    user.is_verified = True
    db.commit()

    # 3. Check if they have completed their profile
    has_profile = db.query(Patient).filter(Patient.user_id == user.id).first() is not None

    # Update user's has_filled_profile field
    user.has_filled_profile = has_profile
    db.commit()


    # 4. Generate JWT Token
    access_token = create_access_token(data={"sub": str(user.id), "role": "PATIENT"})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "profile_completed": has_profile,
        "user_id": str(user.id),
        "message": "OTP verified successfully"
    }

def complete_patient_profile(db: Session, user_id: str, profile_data: PatientCreate):
    # Ensure profile doesn't already exist
    
    existing_profile = db.query(Patient).filter(Patient.user_id == user_id).first()
    if existing_profile:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Profile already exists.")

    new_patient = Patient(
        user_id=user_id,
        name=profile_data.name,
        phone=profile_data.phone,
        age=profile_data.age,
        blood_group=profile_data.blood_group,
        sex=profile_data.sex
    )
    
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    
    return new_patient