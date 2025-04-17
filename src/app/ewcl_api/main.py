from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ewcl_toolkit.ewcl_static_tool_colab import run_ewcl_on_pdb  # ✅ Import your real function
import uvicorn
import os

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

# Optional local run
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=10000)