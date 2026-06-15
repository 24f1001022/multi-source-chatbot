from vector_store import (
    load_vectorstore
)

from llm import ask_llm

from web_search import (
    search_web
)


def retrieve_docs(
    question,
    k=4
):
    try:
        db = load_vectorstore()
        docs = db.similarity_search(
            question,
            k=k
        )
        return docs
    except Exception as e:
        print(f"Vector store not loaded or empty: {e}")
        return []


def rag_answer(
    question
):
    docs = retrieve_docs(
        question
    )

    if not docs:
        return "The Knowledge Base is currently empty. Please upload documents or crawl website URLs in the sidebar to ask questions in Docs mode.", []

    context = "\n\n".join(
        [
            doc.page_content
            for doc in docs
        ]
    )

    prompt = f"""
Answer using ONLY
the document context.

Context:
{context}

Question:
{question}
"""

    answer = ask_llm(prompt)

    return answer, docs


def hybrid_answer(
    question
):

    try:

        rag_resp, docs = (
            rag_answer(question)
        )

    except Exception:

        rag_resp = (
            "No uploaded documents."
        )

        docs = []

    web_results = (
        search_web(question)
    )

    web_context = ""

    for result in web_results:

        web_context += f"""
Title:
{result['title']}

Content:
{result['body']}
"""

    prompt = f"""
Question:
{question}

Document Answer:
{rag_resp}

Internet Results:
{web_context}

Create one final answer.

Use uploaded documents
when relevant.

Use internet information
when relevant.

Mention uncertainty when needed.
"""

    final_answer = ask_llm(
        prompt
    )

    return (
        final_answer,
        docs,
        web_results
    )