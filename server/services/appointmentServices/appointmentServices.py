from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.coreModels import Appointment, Prescription
from models.patient.patientModels import Patient
from models.doctor.doctorModels import Doctor
from schemas.appointment import appointmentSchemas

# --- Patient Actions ---
def book_appointment(db: Session, user_id: str, appointment_data: appointmentSchemas.AppointmentCreate):
    # Find the patient profile linked to the logged-in user
    patient = db.query(Patient).filter(Patient.user_id == user_id).first()
    if not patient:
        raise HTTPException(status_code=400, detail="Patient profile not found. Please complete your profile first.")

    new_appointment = Appointment(
        patient_id=patient.id,
        doctor_id=appointment_data.doctor_id,
        appointment_date=appointment_data.appointment_date,
        illness_description=appointment_data.illness_description,
        status="Pending"
    )
    
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    return new_appointment

def get_patient_appointments(db: Session, user_id: str):
    patient = db.query(Patient).filter(Patient.user_id == user_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found.")
        
    return db.query(Appointment).filter(Appointment.patient_id == patient.id).order_by(Appointment.appointment_date.desc()).all()


# --- Doctor Actions ---
def get_doctor_appointments(db: Session, user_id: str):
    doctor = db.query(Doctor).filter(Doctor.user_id == user_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile not found.")
        
    return db.query(Appointment).filter(Appointment.doctor_id == doctor.id).order_by(Appointment.appointment_date.asc()).all()

def write_prescription(db: Session, user_id: str, prescription_data: appointmentSchemas.PrescriptionCreate):
    doctor = db.query(Doctor).filter(Doctor.user_id == user_id).first()
    if not doctor:
        raise HTTPException(status_code=403, detail="Only doctors can write prescriptions.")

    appointment = db.query(Appointment).filter(Appointment.id == prescription_data.appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found.")
    
    # Ensure this doctor is the one assigned to the appointment
    if appointment.doctor_id != doctor.id:
        raise HTTPException(status_code=403, detail="You are not authorized to respond to this appointment.")

    if appointment.status == "Responded":
        raise HTTPException(status_code=400, detail="A prescription has already been issued for this appointment.")

    # Create the prescription
    new_prescription = Prescription(
        appointment_id=appointment.id,
        notes=prescription_data.notes,
        recommended_tests=prescription_data.recommended_tests
    )
    
    db.add(new_prescription)
    
    # Update appointment status
    appointment.status = "Responded"
    
    db.commit()
    db.refresh(new_prescription)
    return new_prescription