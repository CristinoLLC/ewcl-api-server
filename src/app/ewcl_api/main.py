import sys
import os
import json
import requests
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ewcl_toolkit.ewcl_static_tool_colab import run_ewcl_on_pdb  # ✅ Import your real function
import uvicorn
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

# CORS: Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "EWCL API is live 🚀"}

# ✅ PLACE THIS BLOCK BELOW
@app.post("/runrealewcltest")
async def run_real_ewcl(file: UploadFile = File(...)):
    contents = await file.read()
    
    temp_path = f"/tmp/{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(contents)

    # 🔥 Real EWCL analysis
    result = run_ewcl_on_pdb(temp_path)

    return {
        "filename": file.filename,
        "result": result
    }

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

# Optional local run
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=10000)

# Load the entropy data from a JSON file
data = json.load(open("your-entropy.json"))

# Convert entropyMap (dict) to a list of values
entropy_list = list(data["entropyMap"].values())

# Send the POST request to the API
response = requests.post(
    "https://ewcl-platform.onrender.com/runaiinference",
    json={"entropy": entropy_list}
)

# Print the response
print(response.json())