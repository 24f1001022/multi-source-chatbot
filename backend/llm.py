from huggingface_hub import InferenceClient

from config import HF_TOKEN, MODEL_NAME

client = InferenceClient(api_key=HF_TOKEN)


def ask_llm(question):
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {
                "role": "user",
                "content": question
            }
        ],
        max_tokens=1024
    )

    return response.choices[0].message.content


def ask_llm_stream(question):
    stream = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {
                "role": "user",
                "content": question
            }
        ],
        max_tokens=1024,
        stream=True
    )

    return stream