from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import agents

app = FastAPI(title="AI Agent Builder API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents.router, prefix="/api/v1/agents", tags=["agents"])

@app.get("/health")
async def health_check():
    return {"status": "ok"}
