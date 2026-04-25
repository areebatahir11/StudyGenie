#routes/study.py
from fastapi import APIRouter, Header, HTTPException
from app.schemas.study import (
    ExplainRequest, ExplainResponse,
    NotesRequest, NotesResponse,
    QuizRequest, QuizResponse,
    QuizResultRequest, QuizResultResponse
)
from app.services.ai_agents import explain_agent, notes_agent, mcq_agent, short_answer_agent
from app.core.config import supabase

router = APIRouter()


def get_user_from_token(authorization: str):
    try:
        token = authorization.replace("Bearer ", "")
        user = supabase.auth.get_user(token)
        return user.user
    except:
        return None


@router.post("/explain", response_model=ExplainResponse)
def explain(data: ExplainRequest, authorization: str = Header(None)):
    explanation = explain_agent(data.topic, data.level)

    session_id = None
    if authorization:
        user = get_user_from_token(authorization)
        if user:
            result = supabase.table("study_sessions").insert({
                "user_id": user.id,
                "topic": data.topic,
                "level": data.level,
                "explanation": explanation,
            }).execute()
            if result.data:
                session_id = result.data[0]["id"]

    return {"explanation": explanation, "session_id": session_id}


@router.post("/notes", response_model=NotesResponse)
def get_notes(data: NotesRequest, authorization: str = Header(None)):
    notes = notes_agent(data.topic, data.explanation)

    if authorization:
        user = get_user_from_token(authorization)
        if user:
            # Latest session update karo
            sessions = supabase.table("study_sessions")\
                .select("id")\
                .eq("user_id", user.id)\
                .eq("topic", data.topic)\
                .order("created_at", desc=True)\
                .limit(1)\
                .execute()
            if sessions.data:
                supabase.table("study_sessions")\
                    .update({"notes": notes})\
                    .eq("id", sessions.data[0]["id"])\
                    .execute()

    return {"notes": notes}


@router.post("/quiz", response_model=QuizResponse)
def get_quiz(data: QuizRequest, authorization: str = Header(None)):
    if data.quiz_type == "short":
        quiz = short_answer_agent(data.topic)
    else:
        quiz = mcq_agent(data.topic)

    if authorization:
        user = get_user_from_token(authorization)
        if user:
            sessions = supabase.table("study_sessions")\
                .select("id")\
                .eq("user_id", user.id)\
                .eq("topic", data.topic)\
                .order("created_at", desc=True)\
                .limit(1)\
                .execute()
            if sessions.data:
                supabase.table("study_sessions")\
                    .update({"quiz": quiz})\
                    .eq("id", sessions.data[0]["id"])\
                    .execute()

    return {"quiz": quiz, "quiz_type": data.quiz_type}


@router.post("/quiz-result", response_model=QuizResultResponse)
def save_quiz_result(data: QuizResultRequest, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Login required")

    user = get_user_from_token(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    supabase.table("study_sessions").update(
        {"score": data.score}
    ).eq("id", data.session_id).eq("user_id", user.id).execute()

    percentage = (data.score / data.total) * 100

    if percentage >= 80:
        message = "Excellent! Bohot acha kiya! 🎉"
    elif percentage >= 60:
        message = "Good job! Thodi aur practice karo 👍"
    else:
        message = "Keep trying! Topic dobara padhlo 💪"

    return {
        "message": message,
        "score": data.score,
        "total": data.total,
        "percentage": percentage
    }


@router.get("/history")
def get_history(authorization: str = Header(None)):
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