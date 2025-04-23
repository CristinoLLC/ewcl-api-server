from pydantic import BaseModel
import joblib
import numpy as np

# Define the input model for entropy data
class EntropyInput(BaseModel):
    entropy: list[float]

# Load the pre-trained model
model = joblib.load("models/ewcl_model.pkl")

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

# Define the /runaiinference route
@app.post("/runaiinference")
def run_ai_model(input: EntropyInput):
    features = np.array(extract_summary_features(input.entropy)).reshape(1, -1)
    prediction = model.predict(features)[0]
    return { "predicted_collapse_score": round(float(prediction), 3) }