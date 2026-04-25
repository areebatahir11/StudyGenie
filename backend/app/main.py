#main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.study import router as study_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(study_router)

@app.get("/")
def home():
    return {"message": "AI Study Assistant Running "}