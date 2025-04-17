from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import sys

# Ensure Render finds this ASGI app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify your Vercel domain here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "EWCL API is live"}

@app.post("/runrealewcltest")
async def run_real_ewcl(file: UploadFile = File(...)):
    content = await file.read()
    result = {
        "filename": file.filename,
        "size": len(content),
        "status": "success",
        "collapse_score": 0.828  # Placeholder value
    }
    return result

# Local development runner
if __name__ == "__main__":
    uvicorn.run("src.app.ewcl_api.main:app", host="0.0.0.0", port=10000)