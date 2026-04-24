from app.core.config import client

def call_ai(prompt):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

def explain_agent(topic, level):
    return call_ai(f"Explain {topic} in {level} level simple words")

def notes_agent(explanation):
    return call_ai(f"Convert this into short bullet notes:\n{explanation}")

def quiz_agent(topic):
    return call_ai(f"Create 5 MCQs with answers about {topic}")