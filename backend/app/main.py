from fastapi import FastAPI
from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv()

app = FastAPI()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-pro")

def call_ai(prompt):
    response = model.generate_content(prompt)
    return response.text


# --- Agents ---
def explain_agent(topic, level):
    return call_ai(f"Explain {topic} in {level} level simple words")


def notes_agent(explanation):
    return call_ai(f"Convert this into short bullet notes:\n{explanation}")


def quiz_agent(topic):
    return call_ai(f"Create 5 MCQs with answers about {topic}")


# --- API ---
@app.get("/")
def home():
    return {"message": "AI Study Assistant Running 🚀"}


@app.post("/study")
def study(topic: str, level: str = "beginner"):
    explanation = explain_agent(topic, level)
    notes = notes_agent(explanation)
    quiz = quiz_agent(topic)

    return {
        "explanation": explanation,
        "notes": notes,
        "quiz": quiz
    }