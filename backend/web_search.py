from duckduckgo_search import DDGS

from llm import ask_llm


def search_web(query, max_results=5):

    results = []

    with DDGS() as ddgs:

        search_results = ddgs.text(
            query,
            max_results=max_results
        )

        for r in search_results:

            results.append(
                {
                    "title": r.get("title", ""),
                    "body": r.get("body", ""),
                    "href": r.get("href", "")
                }
            )

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