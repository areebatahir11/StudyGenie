# Study Genie 🧠✨

An AI-powered full-stack co-study platform built with Next.js, FastAPI, Supabase, and Groq LLM APIs.

Study Genie helps students learn topics interactively by generating explanations, structured notes, quizzes, and automated grading feedback — all inside a modern web interface.

Instead of acting like a simple chatbot, the platform is designed as a modular AI learning system where different AI agents independently handle explanations, note generation, quiz creation, and answer evaluation.

---

# 🚀 Features

* AI-generated topic explanations for beginner, intermediate, and advanced learners
* Automatic structured study notes generation
* MCQ quiz generation using LLM APIs
* Short-answer quiz generation with AI grading
* Instant AI-powered feedback and scoring
* Responsive full-stack frontend using Next.js
* JWT authentication and user-based study history
* Prompt injection sanitization for safer AI interactions
* Request validation using Pydantic schemas
* Rate limiting implementation to prevent abuse
* Persistent study session storage using Supabase

---

# 🛠️ Tech Stack

## Frontend

* Next.js
* React.js
* TailwindCSS

## Backend

* FastAPI
* Python
* Pydantic

## AI & Database

* Groq API (Llama 3.3 70B)
* Supabase

## Security & Validation

* JWT Authentication
* Prompt Sanitization
* SlowAPI Rate Limiting
* Input Validation using Pydantic

---

# 🧩 System Workflow

1. User enters a topic and selects difficulty level
2. AI generates a simplified explanation
3. Structured study notes are created automatically
4. User can generate MCQ or short-answer quizzes
5. AI evaluates answers and provides feedback
6. Study sessions and quiz history are stored in Supabase

---

# 📚 AI Modules

## Explain Agent

Generates beginner-to-advanced explanations using Groq LLM APIs.

## Notes Agent

Converts explanations into detailed revision notes with headings and formatting.

## Quiz Agent

Creates MCQ and short-answer quizzes dynamically based on the selected topic.

## Grading Agent

Evaluates short-answer responses and provides scores with feedback.

---

# 🔐 Security Features

* Prompt injection sanitization
* JWT-based authentication
* Request validation using Pydantic
* API rate limiting
* Secure session-based study history

---

# ⚡ API Endpoints

| Endpoint               | Description              |
| ---------------------- | ------------------------ |
| `/explain`             | Generate AI explanation  |
| `/notes`               | Generate study notes     |
| `/quiz`                | Generate quizzes         |
| `/quiz-result`         | Save MCQ quiz result     |
| `/grade-short-answers` | Grade subjective answers |
| `/history`             | Retrieve study history   |

---

# 💡 Project Goal

The goal of Study Genie is to create a lightweight but scalable AI-powered learning assistant that combines studying, revision, testing, and feedback into one seamless workflow while maintaining secure and modular backend architecture.

---

# 🖥️ Run Locally

## Clone Repository

```bash
git clone https://github.com/your-username/study-genie.git
cd study-genie
```

## Backend Setup

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Frontend Setup

```bash
npm install
npm run dev
```

---

# 🌐 Environment Variables

Create a `.env` file and add:

```env
GROQ_API_KEY=your_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
```

---
# Known Limitations

* Invalid or nonsensical topics are currently processed by the LLM instead of being rejected.
* Quiz submission validation is not enforced for empty responses.
* Notes are currently exported as plain text instead of formatted PDF documents.

# 📸 Future Improvements

* Fomatted PDF export for notes
* AI-generated flashcards
* Voice-based study assistant
* Personalized learning recommendations
* Multi-language support
* Dashboard analytics

---

# 👩‍💻 Developer

Built with ❤️ by Areeba Tahir Munir

