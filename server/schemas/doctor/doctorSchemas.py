# tables schema for the  doctors
from pydantic import BaseModel
from uuid import UUID

class DoctorCreate(BaseModel):
    name: str
    specialization: str = "Cardiologist"
    nmr_number: str

class DoctorResponse(DoctorCreate):
    id: UUID
    user_id: UUID

    class Config:
        from_attributes = True

class DoctorListResponse(BaseModel):
    id: UUID
    name: str
    specialization: str
    
    class Config:
        from_attributes = True