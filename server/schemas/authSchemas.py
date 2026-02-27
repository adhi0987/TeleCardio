from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from uuid import UUID
from schemas.patient.patientSchemas import PatientCreate
from schemas.doctor.doctorSchemas import DoctorCreate

class VerifyNMRRequest(BaseModel):
    nmrNumber: str = Field(..., pattern=r"^IN\d{4}$", description="Must be format INXXXX")

class OTPRequest(BaseModel):
    email: Optional[EmailStr] = None
    nmrNumber: Optional[str] = Field(None, pattern=r"^IN\d{4}$")
    role: str

class VerifyOTPRequest(BaseModel):
    email: Optional[EmailStr] = None
    nmrNumber: Optional[str] = Field(None, pattern=r"^IN\d{4}$")
    otp: str
    role: str

class AdminLoginRequest(BaseModel):
    username: str
    password: str

class ProfileCompleteRequest(BaseModel):
    email: Optional[str] = None
    nmrNumber: Optional[str] = None
    role: str
    name: str
    phone: str
    sex: str
    bloodGroup: str

# ==================== Patient Signup Schemas ====================

class PatientSendOTPRequest(BaseModel):
    email: EmailStr

class PatientVerifyOTPRequest(BaseModel):
    email: EmailStr
    otp_code: str

class PatientCompleteProfileRequest(BaseModel):
    user_id: UUID
    profile: PatientCreate

# ==================== Doctor Signup Schemas ====================

class DoctorSendOTPRequest(BaseModel):
    email: EmailStr
    nmr_number: str = Field(..., pattern=r"^IN\d{4}$")

class DoctorVerifyOTPRequest(BaseModel):
    email: EmailStr
    otp_code: str

class DoctorCompleteProfileRequest(BaseModel):
    user_id: UUID
    profile: DoctorCreate
