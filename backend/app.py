from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
import os
import json
import shutil
import re
import urllib.parse

from ingest import DocumentIngestor
from rag import rag_answer, hybrid_answer
from web_search import web_answer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)

ingestor = DocumentIngestor()
METADATA_PATH = "uploads/metadata.json"


class ChatRequest(BaseModel):
    question: str
    mode: str


class UrlRequest(BaseModel):
    url: str


def get_metadata():
    if not os.path.exists(METADATA_PATH):
        return {"sources": []}
    try:
        with open(METADATA_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {"sources": []}


def save_metadata(metadata):
    with open(METADATA_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)


def rebuild_vectorstore():
    metadata = get_metadata()
    pdf_files = []
    txt_files = []
    csv_files = []

    for source in metadata.get("sources", []):
        filename = source.get("filename")
        filepath = f"uploads/{filename}"
        if not os.path.exists(filepath):
            continue

        ext = filename.lower()
        if ext.endswith(".pdf"):
            pdf_files.append(filepath)
        elif ext.endswith(".csv"):
            csv_files.append(filepath)
        elif ext.endswith(".txt"):
            txt_files.append(filepath)

    if not pdf_files and not txt_files and not csv_files:
        # No files remaining, clean up the vector store directory
        if os.path.exists("vectorstore"):
            shutil.rmtree("vectorstore", ignore_errors=True)
        return 0

    try:
        docs = ingestor.load_documents(
            pdf_files=pdf_files,
            txt_files=txt_files,
            csv_files=csv_files
        )
        if not docs:
            if os.path.exists("vectorstore"):
                shutil.rmtree("vectorstore", ignore_errors=True)
            return 0
        chunk_count = ingestor.create_vectorstore(docs)
        return chunk_count
    except Exception as e:
        print(f"Error rebuilding vector store: {e}")
        return 0


@app.api_route("/", methods=["GET", "HEAD"])
def root():
    return {
        "message": "Backend Running"
    }


@app.get("/files")
def get_files():
    metadata = get_metadata()
    return metadata.get("sources", [])


@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    saved_files = []

    for file in files:
        filepath = f"uploads/{file.filename}"

        content = await file.read()

        with open(filepath, "wb") as f:
            f.write(content)

        saved_files.append(filepath)

    # Add to metadata
    metadata = get_metadata()
    for file in files:
        filepath = f"uploads/{file.filename}"
        # Prevent duplicates
        exists = False
        for s in metadata["sources"]:
            if s.get("filename") == file.filename:
                exists = True
                break
        if not exists:
            metadata["sources"].append({
                "name": file.filename,
                "filename": file.filename,
                "type": "file",
                "size": os.path.getsize(filepath) if os.path.exists(filepath) else 0
            })
    save_metadata(metadata)

    chunk_count = rebuild_vectorstore()

    return {
        "status": "success",
        "files": len(saved_files),
        "chunks": chunk_count
    }


@app.post("/upload-url")
def upload_url(req: UrlRequest):
    url = req.url.strip()
    if not url.startswith("http://") and not url.startswith("https://"):
        return {
            "status": "error",
            "message": "Invalid URL protocol. Must start with http:// or https://"
        }

    from utils.loaders import load_website
    try:
        docs = load_website(url)
        if not docs:
            return {
                "status": "error",
                "message": "Failed to crawl website. Verify URL or check internet connection."
            }

        # Save content locally as a txt file for off-line re-indexing
        page_content = "\n\n".join([doc.page_content for doc in docs])

        parsed = urllib.parse.urlparse(url)
        domain = parsed.netloc or "website"
        clean_domain = re.sub(r'[^a-zA-Z0-9_-]', '_', domain)
        url_hash = abs(hash(url)) & 0xffffffff
        filename = f"url_{clean_domain}_{url_hash}.txt"
        filepath = f"uploads/{filename}"

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(page_content)

        metadata = get_metadata()
        exists = False
        for s in metadata["sources"]:
            if s.get("url") == url:
                exists = True
                break
        if not exists:
            metadata["sources"].append({
                "name": url,
                "filename": filename,
                "type": "website",
                "url": url,
                "title": clean_domain
            })
            save_metadata(metadata)

        chunk_count = rebuild_vectorstore()
        return {
            "status": "success",
            "name": url,
            "chunks": chunk_count
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


@app.delete("/files")
def delete_file(name: str):
    metadata = get_metadata()
    sources = metadata.get("sources", [])

    found_source = None
    for s in sources:
        if s.get("name") == name:
            found_source = s
            break

    if not found_source:
        return {
            "status": "error",
            "message": "Source not found."
        }

    filename = found_source.get("filename")
    filepath = f"uploads/{filename}"
    if os.path.exists(filepath):
        try:
            os.remove(filepath)
        except Exception as e:
            print(f"Error removing file: {e}")

    sources.remove(found_source)
    metadata["sources"] = sources
    save_metadata(metadata)

    chunk_count = rebuild_vectorstore()
    return {
        "status": "success",
        "chunks": chunk_count
    }


@app.post("/clear-all")
def clear_all():
    if os.path.exists("uploads"):
        shutil.rmtree("uploads")
    os.makedirs("uploads", exist_ok=True)

    if os.path.exists("vectorstore"):
        shutil.rmtree("vectorstore", ignore_errors=True)

    return {
        "status": "success"
    }


@app.post("/chat")
def chat(request: ChatRequest):
    question = request.question
    mode = request.mode

    try:
        # WEB MODE
        if mode == "web":
            answer, web_results = web_answer(question)

            return {
                "mode": "web",
                "answer": answer,
                "sources": [],
                "web_results": web_results
            }

        # DOCUMENT MODE
        elif mode == "rag":
            answer, docs = rag_answer(question)

            return {
                "mode": "rag",
                "answer": answer,
                "sources": [
                    {
                        "metadata": doc.metadata,
                        "page_content": doc.page_content
                    }
                    for doc in docs
                ]
            }

        # HYBRID MODE
        elif mode == "hybrid":
            answer, docs, web_results = hybrid_answer(question)

            return {
                "mode": "hybrid",
                "answer": answer,
                "sources": [
                    {
                        "metadata": doc.metadata,
                        "page_content": doc.page_content
                    }
                    for doc in docs
                ],
                "web_results": web_results
            }

        else:
            return {
                "error": "Invalid mode"
            }

    except Exception as e:
        return {
            "error": str(e)
        }