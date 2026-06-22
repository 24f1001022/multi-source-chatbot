<div align="center">

# 🤖 MultiSource AI

### *Chat with your documents, the web, or both — all in one place.*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.136-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![LangChain](https://img.shields.io/badge/LangChain-0.3-1C3C3C?style=for-the-badge&logo=chainlink&logoColor=white)](https://langchain.com)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

**[🚀 Live Demo](https://multi-source-chatbot-oz0czl8ki-safwan-humayuns-projects.vercel.app)** · **[🐛 Report Bug](https://github.com/24f1001022/multi-source-chatbot/issues)** · **[✨ Request Feature](https://github.com/24f1001022/multi-source-chatbot/issues)**

![MultiSource AI Banner](frontend/chatbot/src/assets/hero.png)

</div>

---

## 🌟 What is MultiSource AI?

MultiSource AI is an intelligent chatbot that can answer questions from **three different sources** simultaneously — your uploaded documents, live web search, or a hybrid of both. Upload a PDF, paste a website URL, or just ask anything — the AI figures out the best answer.

> *"Stop switching between tools. One chat interface for everything."*

---

## ✨ Features

- 📄 **Document Mode (RAG)** — Upload PDFs, TXTs, or CSVs and chat with them using Retrieval-Augmented Generation
- 🌐 **Web Mode** — Ask anything and get answers powered by live Tavily web search
- ⚡ **Hybrid Mode** — Combines both document knowledge and live web results for the most comprehensive answers
- 🔗 **URL Ingestion** — Paste any website URL and the AI will crawl and index it automatically
- 🗂️ **Knowledge Base** — Manage all your uploaded files and indexed websites from the sidebar
- 💬 **Conversation History** — Recent queries are saved and can be re-run with one click
- 🎨 **3D Animated UI** — Stunning Three.js background with a sleek glassmorphism design
- 📱 **Fully Responsive** — Works beautifully on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **FastAPI** | REST API framework |
| **LangChain** | RAG pipeline & document processing |
| **FAISS** | Vector similarity search |
| **HuggingFace Inference API** | LLM (Mistral-7B) & embeddings |
| **Tavily Search API** | Live web search |
| **sentence-transformers** | Text embeddings (`all-MiniLM-L6-v2`) |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 8** | Build tool |
| **Zustand** | State management |
| **Three.js / R3F** | 3D animated background |
| **Framer Motion** | Smooth animations |
| **Axios** | API communication |
| **react-markdown** | Render markdown responses |

---

## 🗂️ Project Structure

```
multi-source-chatbot/
│
├── backend/
│   ├── app.py              # FastAPI routes & endpoints
│   ├── config.py           # Environment variables & model config
│   ├── llm.py              # HuggingFace LLM wrapper with system prompt
│   ├── rag.py              # RAG & hybrid answer logic
│   ├── vector_store.py     # FAISS vector store operations
│   ├── web_search.py       # Tavily web search integration
│   ├── ingest.py           # Document chunking & ingestion
│   ├── requirements.txt    # Python dependencies
│   └── utils/
│       └── loaders.py      # PDF, TXT, CSV, URL loaders
│
└── frontend/chatbot/
    ├── src/
    │   ├── components/     # React components
    │   │   ├── Sidebar.jsx
    │   │   ├── ChatWindow.jsx
    │   │   ├── Message.jsx
    │   │   ├── FileUpload.jsx
    │   │   ├── PromptBox.jsx
    │   │   ├── Background3d.jsx
    │   │   └── SourceCard.jsx
    │   ├── store/
    │   │   └── chatStore.js    # Zustand global state
    │   ├── api/
    │   │   └── chatApi.js      # Axios API calls
    │   └── pages/
    │       └── Home.jsx
    ├── vercel.json
    └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- [HuggingFace Account](https://huggingface.co) (free API token)
- [Tavily Account](https://tavily.com) (free 1000 searches/month)

### 1. Clone the Repository

```bash
git clone https://github.com/24f1001022/multi-source-chatbot.git
cd multi-source-chatbot
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

Edit `.env`:
```env
HF_TOKEN=your_huggingface_token_here
TAVILY_API_KEY=your_tavily_api_key_here
```

Start the backend:
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Backend runs at → `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend/chatbot

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# Start dev server
npm run dev
```

Frontend runs at → `http://localhost:5173`

---

## ☁️ Deployment

### Backend → Railway

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select repo, set **Root Directory** to `backend`
4. Set **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `HF_TOKEN` = your HuggingFace token
   - `TAVILY_API_KEY` = your Tavily API key
6. Deploy and copy the Railway URL

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import repo
2. Set **Root Directory** to `frontend/chatbot`
3. Add environment variable:
   - `VITE_API_URL` = `https://your-service.up.railway.app`
4. Deploy

### Keep Backend Alive (Free Tier)

Add a free uptime monitor at [uptimerobot.com](https://uptimerobot.com) to ping your Railway URL every 5 minutes — prevents cold starts.

---

## 🔑 Environment Variables

### Backend
| Variable | Description | Required |
|---|---|---|
| `HF_TOKEN` | HuggingFace API token | ✅ |
| `TAVILY_API_KEY` | Tavily Search API key | ✅ |

### Frontend
| Variable | Description | Required |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | ✅ |

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/chat` | Send a message (`question`, `mode`) |
| `POST` | `/upload` | Upload files (PDF, TXT, CSV) |
| `POST` | `/upload-url` | Ingest a website URL |
| `GET` | `/files` | List all indexed sources |
| `DELETE` | `/files` | Delete a specific file |
| `POST` | `/clear-all` | Reset the entire knowledge base |

### Chat Modes
```json
{ "question": "What is machine learning?", "mode": "web" }
{ "question": "Summarize the document", "mode": "rag" }
{ "question": "Explain this topic", "mode": "hybrid" }
```

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Safwan Humayun**

[![GitHub](https://img.shields.io/badge/GitHub-24f1001022-181717?style=for-the-badge&logo=github)](https://github.com/24f1001022)

---

<div align="center">

Made with ❤️ and a lot of ☕

*If you found this project helpful, please consider giving it a ⭐*

</div>