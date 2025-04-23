from fastapi import FastAPI
from api import collapse_ai

app = FastAPI(title="EWCL Protein Analysis API")

# Include the collapse AI router
app.include_router(collapse_ai.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the EWCL Protein Analysis API"}