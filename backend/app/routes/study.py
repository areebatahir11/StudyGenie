from fastapi import APIRouter, Header, HTTPException
from app.schemas.study import StudyRequest, StudyResponse, QuizResultRequest, QuizResultResponse
from app.services.ai_agents import explain_agent, notes_agent, quiz_agent
from app.core.config import supabase

router = APIRouter()

def get_user_from_token(authorization: str):
    """Supabase token se user nikalo"""
    try:
        token = authorization.replace("Bearer ", "")
        user = supabase.auth.get_user(token)
        return user.user
    except:
        return None

@router.post("/study", response_model=StudyResponse)
def study(data: StudyRequest, authorization: str = Header(None)):
    explanation = explain_agent(data.topic, data.level)
    notes = notes_agent(explanation)
    quiz = quiz_agent(data.topic)
    
    session_id = None
    
    # Agar user logged in hai toh history save karo
    if authorization:
        user = get_user_from_token(authorization)
        if user:
            result = supabase.table("study_sessions").insert({
                "user_id": user.id,
                "topic": data.topic,
                "level": data.level,
                "explanation": explanation,
                "notes": notes,
                "quiz": quiz
            }).execute()
            
            if result.data:
                session_id = result.data[0]["id"]

    return {
        "explanation": explanation,
        "notes": notes,
        "quiz": quiz,
        "session_id": session_id
    }

@router.post("/quiz-result", response_model=QuizResultResponse)
def save_quiz_result(data: QuizResultRequest, authorization: str = Header(None)):
    """Quiz ka score save karo"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Login required to save results")
    
    user = get_user_from_token(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Score update karo
    supabase.table("study_sessions").update(
        {"score": data.score}
    ).eq("id", data.session_id).eq("user_id", user.id).execute()
    
    percentage = (data.score / 5) * 100
    
    if percentage >= 80:
        message = "Excellent! Bohot acha kiya! 🎉"
    elif percentage >= 60:
        message = "Good job! Thodi aur practice karo 👍"
    else:
        message = "Keep trying! Topic dobara padhlo 💪"
    
    return {
        "message": message,
        "score": data.score,
        "total": 5,
        "percentage": percentage
    }

@router.get("/history")
def get_history(authorization: str = Header(None)):
    """User ki study history"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Login required")
    
    user = get_user_from_token(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    result = supabase.table("study_sessions")\
        .select("id, topic, level, score, created_at")\
        .eq("user_id", user.id)\
        .order("created_at", desc=True)\
        .limit(10)\
        .execute()
    
    return {"history": result.data}