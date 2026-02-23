from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from core.dependencies import get_current_user
from models.coreModels import User
from services.aiServices import aiServices

router = APIRouter(prefix="/api/ai", tags=["AI Report Analysis"])

@router.post("/analyze-ecg")
async def analyze_ecg(
    file: UploadFile = File(...), 
    current_user: User = Depends(get_current_user) # Locks this endpoint to logged-in users
):
    # Ensure the uploaded file is an image
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image file (PNG/JPG).")
        
    return await aiServices.analyze_ecg_file(file)