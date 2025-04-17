from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify your Vercel frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "EWCL API is live"}

@app.post("/runrealewcltest")
async def run_real_ewcl(file: UploadFile = File(...)):
    # Placeholder logic
    content = await file.read()
    result = {
        "filename": file.filename,
        "size": len(content),
        "status": "success",
        "collapse_score": 0.828  # TODO: Replace with real analysis
    }
    return result

# If running locally (optional)
if __name__ == "__main__":
    import os
    import sys
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    uvicorn.run("main:app", host="0.0.0.0", port=10000)