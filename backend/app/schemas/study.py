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
    quiz_type: str = "mcq"

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

class ShortAnswerItem(BaseModel):
    question: str
    model_answer: str
    student_answer: str

class GradeRequest(BaseModel):
    topic: str
    answers: List[ShortAnswerItem]

class StudyRequest(BaseModel):
    topic: str
    level: str = "beginner"

class StudyResponse(BaseModel):
    explanation: str
    notes: str
    quiz: str
    session_id: Optional[str] = None