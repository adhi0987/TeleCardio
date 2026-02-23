import numpy as np
import tensorflow as tf
from fastapi import UploadFile, HTTPException
import io
from PIL import Image
import os

# Define the path to your model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../../MLmodel/heartbeat_model.h5")
model = None

def load_ai_model():
    """Loads the model into memory only once to save server resources."""
    global model
    if model is None:
        try:
            model = tf.keras.models.load_model(MODEL_PATH)
            print("✅ AI Model loaded successfully!")
        except Exception as e:
            print(f"❌ Error loading AI model: {e}")

async def analyze_ecg_file(file: UploadFile):
    load_ai_model()
    
    if model is None:
        raise HTTPException(status_code=500, detail="AI Model is currently offline or missing.")

    try:
        # 1. Read the uploaded file into memory
        contents = await file.read()
        
        # 2. Preprocess the Image
        # NOTE: You MUST change the resize dimensions to match what your .h5 model expects!
        # (e.g., 224x224, 128x128, etc.)
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        image = image.resize((224, 224)) 
        
        img_array = np.array(image) / 255.0 # Normalize pixel values between 0 and 1
        img_array = np.expand_dims(img_array, axis=0) # Add batch dimension: (1, 224, 224, 3)
        
        # 3. Run the Prediction
        predictions = model.predict(img_array)
        
        # 4. Interpret the Result (Assuming a binary classification: 0=Normal, 1=Abnormal)
        predicted_class = int(np.argmax(predictions, axis=1)[0])
        confidence = float(np.max(predictions)) * 100
        
        # Map class to a human-readable label (Update these based on your specific model)
        labels = {0: "Normal ECG", 1: "Abnormal / Arrhythmia Detected"}
        result_label = labels.get(predicted_class, "Unknown")

        return {
            "filename": file.filename,
            "prediction": result_label,
            "confidence": f"{confidence:.2f}%",
            "raw_scores": predictions[0].tolist()
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process file. Ensure it is a valid image. Error: {str(e)}")