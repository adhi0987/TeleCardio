import uuid
import enum
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, DateTime, ForeignKey, Enum, Text
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from database.database import Base

class UserRole(str, enum.Enum):
    PATIENT = "PATIENT"
    DOCTOR = "DOCTOR"

class User(Base):
    __tablename__ = "User"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    role = Column(Enum(UserRole), nullable=False)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    has_filled_profile = Column(Boolean, default=False)
    patient_profile = relationship("Patient", back_populates="user", uselist=False, cascade="all, delete")
    doctor_profile = relationship("Doctor", back_populates="user", uselist=False, cascade="all, delete")

class Otp(Base):
    __tablename__ = "Otp"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, nullable=False, index=True)
    otp_code = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Appointment(Base):
    __tablename__ = "Appointment"

    id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("Patient.id", ondelete="CASCADE"))
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("Doctor.id", ondelete="CASCADE"))
    appointment_date = Column(DateTime, nullable=False)
    status = Column(String, default="Pending") # Pending, Responded, Cancelled
    illness_description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    prescription = relationship("Prescription", back_populates="appointment", uselist=False)

class Prescription(Base):
    __tablename__ = "Prescription"

    id = Column(Integer, primary_key=True, autoincrement=True)
    appointment_id = Column(Integer, ForeignKey("Appointment.id", ondelete="CASCADE"), unique=True)
    notes = Column(Text, nullable=False)
    recommended_tests = Column(ARRAY(String)) 
    pdf_url = Column(String)
    issued_at = Column(DateTime, default=datetime.utcnow)

    appointment = relationship("Appointment", back_populates="prescription")