import os
from dotenv import load_dotenv
from groq import Groq
from supabase import create_client

load_dotenv()

# Groq setup
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Supabase setup
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)