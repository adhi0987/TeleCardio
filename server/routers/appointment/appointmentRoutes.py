from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database.database import get_db
from core.dependencies import get_current_user
from models.coreModels import User, UserRole
from schemas.appointment import appointmentSchemas
from services.appointmentServices import appointmentServices

router = APIRouter(prefix="/api/appointments", tags=["Appointments & Prescriptions"])

@router.post("/book", response_model=appointmentSchemas.AppointmentResponse)
def book_appointment(
    request: appointmentSchemas.AppointmentCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.PATIENT:
        raise HTTPException(status_code=403, detail="Only patients can book appointments.")
    return appointmentServices.book_appointment(db, current_user.id, request)

@router.get("/patient", response_model=List[appointmentSchemas.AppointmentResponse])
def view_patient_appointments(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.PATIENT:
        raise HTTPException(status_code=403, detail="Access denied.")
    return appointmentServices.get_patient_appointments(db, current_user.id)

@router.get("/doctor", response_model=List[appointmentSchemas.AppointmentResponse])
def view_doctor_appointments(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.DOCTOR:
        raise HTTPException(status_code=403, detail="Access denied.")
    return appointmentServices.get_doctor_appointments(db, current_user.id)

@router.post("/prescribe", response_model=appointmentSchemas.PrescriptionResponse)
def write_prescription(
    request: appointmentSchemas.PrescriptionCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.DOCTOR:
        raise HTTPException(status_code=403, detail="Only doctors can write prescriptions.")
    return appointmentServices.write_prescription(db, current_user.id, request)

@router.get("/prescription/{appointment_id}", response_model=appointmentSchemas.PrescriptionResponse)
def get_prescription(
    appointment_id: int,
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Get prescription for an appointment"""
    return appointmentServices.get_prescription(db, appointment_id)

