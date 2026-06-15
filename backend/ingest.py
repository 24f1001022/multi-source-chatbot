from langchain_text_splitters import (
    RecursiveCharacterTextSplitter
)

from utils.loaders import (
    load_pdf,
    load_csv,
    load_txt,
    load_website
)

from vector_store import (
    save_vectorstore
)


class DocumentIngestor:

    def __init__(self):

        self.splitter = (
            RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200
            )
        )

    def load_documents(
        self,
        pdf_files=None,
        csv_files=None,
        txt_files=None,
        websites=None
    ):

        docs = []

        pdf_files = pdf_files or []
        csv_files = csv_files or []
        txt_files = txt_files or []
        websites = websites or []

        for file in pdf_files:
            loaded = load_pdf(file)
            print("PDF:", file)
            print("Loaded:", len(loaded))
            docs.extend(loaded)

        for file in csv_files:
            loaded = load_csv(file)

            print("CSV:", file)
            print("Loaded:", len(loaded))

            docs.extend(loaded)

        for file in txt_files:
            loaded = load_txt(file)

            print("TXT:", file)
            print("Loaded:", len(loaded))

            docs.extend(loaded)

        for url in websites:
            docs.extend(load_website(url))
        print("TOTAL DOCS:", len(docs))
        return docs

    def create_vectorstore(
        self,
        documents
    ):

        if not documents:
            raise ValueError(
                "No documents loaded."
            )

        chunks = (
            self.splitter.split_documents(
                documents
            )
        )

        save_vectorstore(chunks)

        return len(chunks)