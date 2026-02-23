# model for the patient table 
from pydantic import BaseModel, EmailStr
from uuid import UUID

# --- Shared OTP Auth Schemas ---
class SendOTPRequest(BaseModel):
    email: EmailStr
    role: str # Must be "PATIENT" or "DOCTOR"

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp_code: str

# --- Patient Profile Schemas ---
class PatientCreate(BaseModel):
    name: str
    phone: str
    age: int
    blood_group: str
    sex: str

class PatientResponse(PatientCreate):
    id: UUID
    user_id: UUID

    class Config:
        from_attributes = True # Allows Pydantic to read SQLAlchemy models