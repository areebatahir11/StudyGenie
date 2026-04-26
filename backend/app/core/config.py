import os
from dotenv import load_dotenv
from groq import Groq
from supabase import create_client
from slowapi import Limiter
from slowapi.util import get_remote_address

load_dotenv()

# Groq setup
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Supabase setup
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

# Limiter — yahan rakho taake circular import na ho
limiter = Limiter(key_func=get_remote_address)