import os
import requests
from llm import ask_llm

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")


def search_web(query, max_results=5):
    results = []

    try:
        response = requests.post(
            "https://api.tavily.com/search",
            json={
                "api_key": TAVILY_API_KEY,
                "query": query,
                "max_results": max_results,
                "search_depth": "basic"
            },
            timeout=10
        )
        data = response.json()

        for r in data.get("results", []):
            results.append({
                "title": r.get("title", ""),
                "body": r.get("content", ""),
                "href": r.get("url", "")
            })

    except Exception as e:
        print(f"Search error: {e}")

    return results


def web_answer(question):
    results = search_web(question)

    context = ""
    for r in results:
        context += f"""
Title: {r['title']}
Content: {r['body']}
URL: {r['href']}
"""

    prompt = f"""
Answer the question using the search results.

Question:
{question}

Search Results:
{context}
"""

    answer = ask_llm(prompt)
    return answer, results