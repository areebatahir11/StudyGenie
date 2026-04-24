#schemas/study.py
from pydantic import BaseModel
from typing import Optional

class StudyRequest(BaseModel):
    topic: str
    level: str = "beginner"

class StudyResponse(BaseModel):
    explanation: str
    notes: str
    quiz: str
    session_id: Optional[str] = None  # history ke liye

class QuizResultRequest(BaseModel):
    session_id: str
    score: int  # 0-5 (5 questions hain)

class QuizResultResponse(BaseModel):
    message: str
    score: int
    total: int
    percentage: float