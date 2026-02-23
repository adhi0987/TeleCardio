from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

# --- Appointment Schemas ---
class AppointmentCreate(BaseModel):
    doctor_id: UUID # The specific ID from the Doctor profile table
    appointment_date: datetime
    illness_description: str

class AppointmentResponse(BaseModel):
    id: int
    patient_id: UUID
    doctor_id: UUID
    appointment_date: datetime
    status: str
    illness_description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Prescription Schemas ---
class PrescriptionCreate(BaseModel):
    appointment_id: int
    notes: str
    recommended_tests: List[str] = []

class PrescriptionResponse(BaseModel):
    id: int
    appointment_id: int
    notes: str
    recommended_tests: List[str]
    issued_at: datetime

    class Config:
        from_attributes = True