from huggingface_hub import InferenceClient
from config import HF_TOKEN, MODEL_NAME

client = InferenceClient(api_key=HF_TOKEN)

SYSTEM_PROMPT = """You are a helpful, friendly AI assistant. 
- For greetings like "hello", "hi", "hey" — respond naturally and warmly, ask how you can help.
- For general questions — answer conversationally and concisely.
- For questions about documents or search results — summarize the relevant information clearly.
- Never over-explain simple greetings or casual messages.
- Keep responses concise unless detailed explanation is needed."""


def ask_llm(prompt):
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        max_tokens=1024
    )
    return response.choices[0].message.content


def ask_llm_stream(prompt):
    stream = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        max_tokens=1024,
        stream=True
    )
    return stream