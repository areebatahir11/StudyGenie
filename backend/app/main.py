from fastapi import FastAPI
from app.routes.study import router as study_router

app = FastAPI()

app.include_router(study_router)

@app.get("/")
def home():
    return {"message": "AI Study Assistant Running "}