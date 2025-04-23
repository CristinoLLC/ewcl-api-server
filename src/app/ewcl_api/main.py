import sys
import os
import json
import requests
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ewcl_toolkit.ewcl_static_tool_colab import run_ewcl_on_pdb
import uvicorn
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

# CORS: Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Restrict to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "EWCL API is live 🚀"}

@app.post("/runrealewcltest")
async def run_real_ewcl(file: UploadFile = File(...)):
    # Basic security check for filename (optional but recommended)
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    safe_filename = os.path.basename(file.filename)  # Avoid directory traversal
    temp_path = f"/tmp/{safe_filename}"  # Use a temporary directory

    try:
        contents = await file.read()
        with open(temp_path, "wb") as f:
            f.write(contents)

        # Real EWCL analysis
        result = run_ewcl_on_pdb(temp_path)  # Ensure this function handles its own errors

        return {
            "filename": safe_filename,
            "result": result  # Ensure result is JSON serializable
        }
    except Exception as e:
        print(f"Error during EWCL analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing file: {e}")
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except OSError as e:
                print(f"Error removing temporary file {temp_path}: {e}")


# Define the input model for entropy data
class EntropyInput(BaseModel):
    entropy: list[float]

# --- UPDATED MODEL LOADING ---
try:
    # Construct the absolute path to the model file relative to main.py
    base_dir = os.path.dirname(__file__)  # Directory of main.py (src/app/ewcl_api)
    model_path = os.path.join(base_dir, "models", "ewcl_model.pkl")  # Path: src/app/ewcl_api/models/ewcl_model.pkl

    print(f"Attempting to load model from: {model_path}")  # Debug print

    # Explicitly check if the file exists before trying to load
    if not os.path.exists(model_path):
        print(f"Error: Model file not found at calculated path: {model_path}")
        raise FileNotFoundError(f"Model file not found at {model_path}")

    # Load the model
    model = joblib.load(model_path)
    print("Model loaded successfully.")  # Debug print

# Catch FileNotFoundError specifically
except FileNotFoundError as e:
    print(f"File Not Found Error during model load: {e}")
    sys.exit("Model file not found. API cannot start.")
# Catch other potential errors during loading (e.g., corrupted file)
except Exception as e:
    print(f"An unexpected error occurred loading model: {e}")
    sys.exit("Failed to load model. API cannot start.")
# --- END UPDATED MODEL LOADING ---


# Function to extract summary features from entropy data
def extract_summary_features(entropy_list_input):
    if not entropy_list_input:  # Handle empty list case
        print("Warning: Received empty entropy list for feature extraction.")
        return [0.0] * 8  # Or handle as error if model can't predict on zeros

    arr = np.array(entropy_list_input)
    return [
        float(len(arr)),
        float(np.mean(arr)),
        float(np.std(arr)),
        float(np.min(arr)),
        float(np.percentile(arr, 25)),
        float(np.median(arr)),
        float(np.percentile(arr, 75)),
        float(np.max(arr)),
    ]

# Define the /runaiinference route
@app.post("/runaiinference")
def run_ai_model(input_data: EntropyInput):
    try:
        # Extract the 8 features the function provides
        all_features = extract_summary_features(input_data.entropy)

        # Select only the 4 features the model expects
        model_features_indices = [0, 1, 2, 7]
        selected_features = [all_features[i] for i in model_features_indices]

        # Reshape for the model (1 sample, 4 features)
        features_for_model = np.array(selected_features).reshape(1, 4)

        # Predict
        prediction = model.predict(features_for_model)[0]

        return {"predicted_collapse_score": round(float(prediction), 3)}

    except IndexError:
        print("Error: Feature selection index out of bounds.")
        raise HTTPException(status_code=500, detail="Internal error during feature selection.")
    except Exception as e:
        print(f"Error during AI model prediction: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")


# Optional local run configuration
if __name__ == "__main__":
    local_port = int(os.environ.get("PORT", 8000))  # Default to 8000 if PORT not set
    print(f"Running Uvicorn locally on http://0.0.0.0:{local_port}")
    uvicorn.run("main:app", host="0.0.0.0", port=local_port, reload=True)