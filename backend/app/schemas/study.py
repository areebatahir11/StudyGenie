from pydantic import BaseModel, field_validator, Field
from typing import Optional, List

ALLOWED_LEVELS = {"beginner", "intermediate", "advanced"}

class ExplainRequest(BaseModel):
    topic: str = Field(..., min_length=2, max_length=200)
    level: str = Field(default="beginner")

    @field_validator('level')
    @classmethod
    def validate_level(cls, v):
        if v not in ALLOWED_LEVELS:
            raise ValueError("Level must be beginner, intermediate, or advanced")
        return v

class NotesRequest(BaseModel):
    topic: str = Field(..., min_length=2, max_length=200)
    explanation: str = Field(..., max_length=5000)

class QuizRequest(BaseModel):
    topic: str = Field(..., min_length=2, max_length=200)
    quiz_type: str = Field(default="mcq")

    @field_validator('quiz_type')
    @classmethod
    def validate_quiz_type(cls, v):
        if v not in {"mcq", "short"}:
            raise ValueError("quiz_type must be mcq or short")
        return v

class QuizResultRequest(BaseModel):
    session_id: str = Field(..., min_length=36, max_length=36)  # UUID format
    score: int = Field(..., ge=0, le=5)
    total: int = Field(..., ge=1, le=10)

class ShortAnswerItem(BaseModel):
    question: str = Field(..., max_length=500)
    model_answer: str = Field(..., max_length=1000)
    student_answer: str = Field(..., max_length=1000)

class GradeRequest(BaseModel):
    topic: str = Field(..., min_length=2, max_length=200)
    answers: List[ShortAnswerItem] = Field(..., min_length=1, max_length=10)

# Baaki classes same rahengi
class ExplainResponse(BaseModel):
    explanation: str
    session_id: Optional[str] = None

class NotesResponse(BaseModel):
    notes: str

class QuizResponse(BaseModel):
    quiz: str
    quiz_type: str

class QuizResultResponse(BaseModel):
    message: str
    score: int
    total: int
    percentage: float

class StudyRequest(BaseModel):
    topic: str
    level: str = "beginner"

class StudyResponse(BaseModel):
    explanation: str
    notes: str
    quiz: str
    session_id: Optional[str] = None