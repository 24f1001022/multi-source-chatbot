import os

os.environ["USER_AGENT"] = "MultiSourceAI/1.0"

from langchain_community.document_loaders import (
    PyPDFLoader,
    CSVLoader,
    TextLoader,
    WebBaseLoader
)


def load_pdf(path):
    try:
        return PyPDFLoader(path).load()
    except Exception as e:
        print(f"PDF Error: {e}")
        return []


def load_csv(path):
    try:
        return CSVLoader(path).load()
    except Exception as e:
        print(f"CSV Error: {e}")
        return []


def load_txt(path):
    try:
        return TextLoader(
            path,
            encoding="utf-8"
        ).load()
    except Exception as e:
        print(f"TXT Error: {e}")
        return []


def load_website(url):
    try:
        return WebBaseLoader(url).load()
    except Exception as e:
        print(f"Website Error: {e}")
        return []