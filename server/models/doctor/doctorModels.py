# models for  doctors
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from database.database import Base

class Doctor(Base):
    __tablename__ = "Doctor"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("User.id", ondelete="CASCADE"), unique=True)
    name = Column(String, nullable=False)
    specialization = Column(String, default="Cardiologist")
    nmr_number = Column(String, unique=True, nullable=False)

    user = relationship("User", back_populates="doctor_profile")