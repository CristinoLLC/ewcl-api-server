from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import numpy as np
import joblib
import os

router = APIRouter()

# Define input schema
class EntropyInput(BaseModel):
    entropy: List[float]

# Define output schema
class CollapseOutput(BaseModel):
    predicted_collapse_score: float

# Load the random forest model
model_path = os.path.join(os.path.dirname(__file__), "../models/collapse_rf_model.pkl")
try:
    model = joblib.load(model_path)
    print(f"Loaded collapse prediction model successfully from {model_path}")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@router.post("/runaiinference", response_model=CollapseOutput)
async def predict_collapse(input_data: EntropyInput):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    # Extract entropy values
    entropy_values = np.array(input_data.entropy)
    
    # Calculate statistical features
    length = len(entropy_values)
    mean = np.mean(entropy_values)
    std = np.std(entropy_values)
    min_val = np.min(entropy_values)
    p25 = np.percentile(entropy_values, 25)
    p50 = np.percentile(entropy_values, 50)  # median
    p75 = np.percentile(entropy_values, 75)
    max_val = np.max(entropy_values)
    
    # Create feature vector matching the training format
    features = np.array([[length, mean, std, min_val, p25, p50, p75, max_val]])
    
    # Make prediction using the RandomForest model
    predicted_score = float(model.predict(features)[0])
    
    # Round to 3 decimal places
    predicted_score = round(predicted_score, 3)
    
    return CollapseOutput(predicted_collapse_score=predicted_score)