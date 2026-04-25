#schemas/study.py
from pydantic import BaseModel
from typing import Optional, List

class ExplainRequest(BaseModel):
    topic: str
    level: str = "beginner"

class ExplainResponse(BaseModel):
    explanation: str
    session_id: Optional[str] = None

class NotesRequest(BaseModel):
    topic: str
    explanation: str

class NotesResponse(BaseModel):
    notes: str

class QuizRequest(BaseModel):
    topic: str
    quiz_type: str = "mcq"  # "mcq" ya "short"

class QuizResponse(BaseModel):
    quiz: str
    quiz_type: str

class QuizResultRequest(BaseModel):
    session_id: str
    score: int
    total: int

class QuizResultResponse(BaseModel):
    message: str
    score: int
    total: int
    percentage: float

# Purana bhi rakho taake history kaam kare
class StudyRequest(BaseModel):
    topic: str
    level: str = "beginner"

class StudyResponse(BaseModel):
    explanation: str
    notes: str
    quiz: str
    session_id: Optional[str] = None