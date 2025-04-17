from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import io
import random

app = FastAPI()

# Allow connections from frontend (e.g., Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 🔬 EWCL MOCK ENGINE (replace with your real logic) ---
def compute_entropy_scores(pdb_file):
    # Fake entropy values for 100 residues
    return [round(random.uniform(0.1, 1.0), 3) for _ in range(100)]

def find_hotspot(score_map):
    # Return residue index with highest collapse likelihood
    return score_map.index(max(score_map))

def match_against_known(region_index):
    # Simulate a match to a known structure
    return f"Match: Region {region_index} resembles BRCA1 (simulated)"

def run_ewcl_on_pdb(pdb_file):
    scores = compute_entropy_scores(pdb_file)
    hotspot = find_hotspot(scores)
    matched = match_against_known(hotspot)

    return {
        "score_map": scores,
        "top_residue": hotspot,
        "matched_structure": matched
    }

# --- ✅ API Endpoint ---
@app.post("/runrealewcltest")
async def run_real_ewcl(file: UploadFile = File(...)):
    content = await file.read()
    pdb_file = io.BytesIO(content)

    try:
        result = run_ewcl_on_pdb(pdb_file)
        return {
            "filename": file.filename,
            "top_residue": result["top_residue"],
            "collapse_scores": result["score_map"],
            "match": result["matched_structure"],
            "status": "success"
        }
    except Exception as e:
        return {"error": str(e), "status": "fail"}

# --- Optional Health Check ---
@app.get("/")
def root():
    return {"message": "🧬 EWCL API is running"}