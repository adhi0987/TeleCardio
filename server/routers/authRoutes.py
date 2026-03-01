import random
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from schemas.authSchemas import (
    VerifyNMRRequest, 
    OTPRequest, 
    VerifyOTPRequest, 
    AdminLoginRequest, 
    ProfileCompleteRequest,
    PatientSendOTPRequest,
    PatientVerifyOTPRequest,
    PatientCompleteProfileRequest,
    DoctorSendOTPRequest,
    DoctorVerifyOTPRequest,
    DoctorCompleteProfileRequest
)
from database.database import get_db
from services.patientServices import patientServices
from services.doctorServices import doctorServices
from services.adminServices import adminServices
from models.doctor.doctorModels import Doctor
from models.coreModels import User, UserRole

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# ==================== PATIENT SIGNUP ====================

@router.post("/patient/send-otp")
async def patient_send_otp(data: PatientSendOTPRequest, db: Session = Depends(get_db)):
    """Send OTP to patient's email for signup"""
    return patientServices.request_patient_otp(db=db, email=data.email)

@router.post("/patient/verify-otp")
async def patient_verify_otp(data: PatientVerifyOTPRequest, db: Session = Depends(get_db)):
    """Verify OTP and return JWT token"""
    result = patientServices.verify_patient_otp(db=db, email=data.email, otp_code=data.otp_code)
    return result

@router.post("/patient/complete-profile")
async def patient_complete_profile(data: PatientCompleteProfileRequest, db: Session = Depends(get_db)):
    """Complete patient profile after OTP verification"""
    return patientServices.complete_patient_profile(
        db=db, 
        user_id=str(data.user_id), 
        profile_data=data.profile
    )

# ==================== DOCTOR SIGNUP ====================

@router.post("/doctor/send-otp")
async def doctor_send_otp(data: DoctorSendOTPRequest, db: Session = Depends(get_db)):
    """Send OTP to doctor's email for signup"""
    # First verify NMR is valid and not already registered
    existing_doctor = db.query(Doctor).filter(Doctor.nmr_number == data.nmr_number).first()
    if existing_doctor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="This NMR number is already registered."
        )
    return doctorServices.request_doctor_otp(db=db, email=data.email)

@router.post("/doctor/verify-otp")
async def doctor_verify_otp(data: DoctorVerifyOTPRequest, db: Session = Depends(get_db)):
    """Verify OTP and return JWT token"""
    result = doctorServices.verify_doctor_otp(db=db, email=data.email, otp_code=data.otp_code)
    return result

@router.post("/doctor/complete-profile")
async def doctor_complete_profile(data: DoctorCompleteProfileRequest, db: Session = Depends(get_db)):
    """Complete doctor profile after OTP verification"""
    return doctorServices.complete_doctor_profile(
        db=db, 
        user_id=str(data.user_id), 
        profile_data=data.profile
    )

# ==================== NMR VERIFICATION ====================

@router.post("/verify-nmr")
async def verify_nmr(data: VerifyNMRRequest, db: Session = Depends(get_db)):
    """Verify NMR number exists in database"""
    # Check if NMR is already registered
    existing_doctor = db.query(Doctor).filter(Doctor.nmr_number == data.nmrNumber).first()
    
    if not existing_doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="NMR number not found in medical registry."
        )
    
    # Get the associated user email
    user = db.query(User).filter(User.id == existing_doctor.user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found for this NMR."
        )
    
    return {
        "message": "NMR Verified", 
        "email": user.email,
        "name": existing_doctor.name
    }

# ==================== ADMIN LOGIN ====================

@router.post("/admin/login")
async def admin_login(data: AdminLoginRequest, db: Session = Depends(get_db)):
    """Admin login with username and password"""
    result = adminServices.verify_admin_credentials(
        db=db, 
        username=data.username, 
        password=data.password
    )
    return result

# ==================== LEGACY/MOCK ENDPOINTS (For backwards compatibility) ====================

# Mock Databases for illustration (Replace with actual DB queries)
MOCK_DOCTOR_DB = {"IN1234": "doctor1@telecardio.com", "IN9876": "doctor2@telecardio.com"}
MOCK_OTP_STORE = {} # Format: { identifier: otp }
MOCK_USERS_DB = {} # To check if user profile exists

@router.post("/send-otp")
async def send_otp(data: OTPRequest):
    identifier = ""
    if data.role == "patient":
        if not data.email:
            raise HTTPException(status_code=400, detail="Email is required for patients")
        identifier = data.email
    elif data.role == "doctor":
        if not data.nmrNumber:
            raise HTTPException(status_code=400, detail="NMR is required for doctors")
        identifier = MOCK_DOCTOR_DB.get(data.nmrNumber)
        if not identifier:
            raise HTTPException(status_code=404, detail="Invalid NMR")

    # Generate a 6-digit OTP
    otp = str(random.randint(100000, 999999))
    MOCK_OTP_STORE[identifier] = otp
    
    # TODO: Integrate your email.py utility here to actually send it
    print(f"[MOCK EMAIL] Sent OTP {otp} to {identifier}")
    
    return {"message": f"OTP sent successfully to {identifier}"}

@router.post("/verify-otp")
async def verify_otp(data: VerifyOTPRequest):
    identifier = data.email if data.role == "patient" else MOCK_DOCTOR_DB.get(data.nmrNumber)
    
    if not identifier or MOCK_OTP_STORE.get(identifier) != data.otp:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired OTP")
    
    # OTP is valid, clear it
    del MOCK_OTP_STORE[identifier]

    # Check if user has completed their profile
    is_new_user = identifier not in MOCK_USERS_DB
    
    # Mock Token
    token = f"mock_jwt_token_for_{identifier}"
    
    return {
        "message": "Login successful", 
        "token": token, 
        "isNewUser": is_new_user
    }

@router.post("/complete-profile")
async def complete_profile(data: ProfileCompleteRequest):
    identifier = data.email if data.role == "patient" else data.nmrNumber
    MOCK_USERS_DB[identifier] = data.dict()
    return {"message": "Profile completed successfully"}

