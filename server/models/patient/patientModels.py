# models for the patients
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from database.database import Base

class Patient(Base):
    __tablename__ = "Patient"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("User.id", ondelete="CASCADE"), unique=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    blood_group = Column(String, nullable=False)
    sex = Column(String, nullable=False) # Male, Female, Others

    # Use string "User" to avoid circular imports
    user = relationship("User", back_populates="patient_profile")