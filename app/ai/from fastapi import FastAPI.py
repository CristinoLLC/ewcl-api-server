from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import joblib

app = FastAPI()

# Define the input model
class EntropyInput(BaseModel):
    entropy: list[float]

# Load the pre-trained model
model = joblib.load("models/collapse_rf_model.pkl")

# Function to extract summary features from entropy data
def extract_summary_features(entropy):
    arr = np.array(entropy)
    return [
        len(arr),
        np.mean(arr),
        np.std(arr),
        np.min(arr),
        np.percentile(arr, 25),
        np.median(arr),
        np.percentile(arr, 75),
        np.max(arr),
    ]

# Endpoint to handle AI inference
@app.post("/runaiinference")
def runaiinference(input: EntropyInput):
    features = np.array(extract_summary_features(input.entropy)).reshape(1, -1)
    prediction = model.predict(features)[0]
    return { "predicted_collapse_score": round(float(prediction), 3) }