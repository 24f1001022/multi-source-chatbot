from langchain_community.vectorstores import FAISS

from langchain_huggingface import (
    HuggingFaceEmbeddings
)

from config import (
    EMBEDDING_MODEL,
    VECTOR_DB_PATH
)


def get_embeddings():

    return HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL
    )


def save_vectorstore(chunks):

    embeddings = get_embeddings()

    db = FAISS.from_documents(
        chunks,
        embeddings
    )

    db.save_local(
        VECTOR_DB_PATH
    )

    return db


def load_vectorstore():

    embeddings = get_embeddings()

    db = FAISS.load_local(
        VECTOR_DB_PATH,
        embeddings,
        allow_dangerous_deserialization=True
    )

    return db