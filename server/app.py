from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import engine, Base
from models import coreModels 
from routers.patient import patientRoutes
from routers.doctor import doctorRoutes # <-- Add this
from routers.admin import adminRoutes   # <-- Add this
from routers.appointment import appointmentRoutes
from routers.ai import aiRoutes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="TeleCardio API", description="Backend for Cardiology Telemedicine Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers here
app.include_router(patientRoutes.router)
app.include_router(doctorRoutes.router) # <-- Add this
app.include_router(adminRoutes.router)  # <-- Add this
app.include_router(appointmentRoutes.router)
app.include_router(aiRoutes.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the TeleCardio API!"}