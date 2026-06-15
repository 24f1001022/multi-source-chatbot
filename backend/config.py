import os

from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")

MODEL_NAME = "Qwen/Qwen2.5-7B-Instruct"

EMBEDDING_MODEL = (
    "sentence-transformers/all-MiniLM-L6-v2"
)

VECTOR_DB_PATH = "vectorstore"