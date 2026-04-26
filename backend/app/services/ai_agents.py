from app.core.config import client


def sanitize_input(text: str) -> str:
    text = text.strip()[:200]
    banned = [
        "ignore previous instructions",
        "ignore all instructions",
        "disregard your instructions",
        "system prompt:",
        "jailbreak",
        "dan mode",
        "developer mode",
        "ignore your training",
    ]
    lower = text.lower()
    for phrase in banned:
        if phrase in lower:
            raise ValueError("Invalid input detected")
    return text


def call_ai(prompt):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile", messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content


def explain_agent(topic, level):
    topic = sanitize_input(topic)
    level = sanitize_input(level)
    return call_ai(
        f"""You are a friendly tutor. Explain '{topic}' for a {level} level student.
Use simple language, real-life examples, and keep it engaging.
Use proper headings and formatting. Max 300 words."""
    )


def notes_agent(topic, explanation):
    topic = sanitize_input(topic)
    # explanation sanitize nahi — ye AI ka output hai, user input nahi
    return call_ai(
        f"""Create detailed, well-formatted study notes about '{topic}'.
Based on this explanation: {explanation}

Format with:
- Main headings (##)
- Subheadings (###)
- Bullet points
- Key terms in bold
- Examples where needed
Make it comprehensive and easy to read."""
    )


def mcq_agent(topic):
    topic = sanitize_input(topic)
    return call_ai(
        f"""Create exactly 5 MCQ questions about '{topic}'.
Format EXACTLY like this:

Q1. Question here?
A) Option 1
B) Option 2
C) Option 3
D) Option 4
ANSWER: A

Q2. Question here?
A) Option 1
B) Option 2
C) Option 3
D) Option 4
ANSWER: B

Continue for all 5 questions. Keep beginner friendly."""
    )


def short_answer_agent(topic):
    topic = sanitize_input(topic)
    return call_ai(
        f"""Create exactly 5 short answer questions about '{topic}'.
Format EXACTLY like this:

Q1. Question here?
ANSWER: Brief answer here (1-2 sentences max)

Q2. Question here?
ANSWER: Brief answer here

Continue for all 5 questions."""
    )


def grade_short_answers(topic, questions_and_answers):
    topic = sanitize_input(topic)
    qa_text = ""
    for i, qa in enumerate(questions_and_answers):
        qa_text += f"""
Q{i+1}: {qa['question']}
Model Answer: {qa['model_answer']}
Student Answer: {qa['student_answer']}
"""
    return call_ai(
        f"""You are a teacher grading short answer questions about '{topic}'.
Grade each answer from 0 to 1 (1 = correct, 0.5 = partially correct, 0 = wrong).

{qa_text}

Respond EXACTLY in this format for each question:
Q1_SCORE: 1
Q1_FEEDBACK: Brief feedback here

Q2_SCORE: 0.5
Q2_FEEDBACK: Brief feedback here

Continue for all questions. Be fair and encouraging."""
    )
