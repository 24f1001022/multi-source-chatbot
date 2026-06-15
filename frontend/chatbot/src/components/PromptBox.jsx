import { useState } from "react";
import { Send, Globe, Database, Sparkles } from "lucide-react";
import useChatStore from "../store/chatStore";

export default function PromptBox() {
  const [text, setText] = useState("");

  const mode = useChatStore((state) => state.mode);
  const setMode = useChatStore((state) => state.setMode);
  const submitMessage = useChatStore((state) => state.submitMessage);
  const isSending = useChatStore((state) => state.isSending);

  const handleSend = () => {
    if (!text.trim() || isSending) return;
    submitMessage(text);
    setText("");
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "linear-gradient(to top, #030712 60%, transparent)",
      }}
    >
      <div
        className="glass"
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          borderRadius: "24px",
          padding: "15px",
          boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.7)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "12px",
          }}
        >
          <button
            className={`sidebar-btn ${mode === "web" ? "mode-active" : ""}`}
            onClick={() => setMode("web")}
            style={{
              flex: 1,
              background: mode === "web" ? "rgba(96, 165, 250, 0.15)" : "rgba(255, 255, 255, 0.04)",
              borderColor: mode === "web" ? "#60a5fa" : "transparent",
            }}
          >
            <Globe size={16} color={mode === "web" ? "#60a5fa" : "#9ca3af"} />
            <span style={{ color: mode === "web" ? "#60a5fa" : "#e5e7eb" }}>Web Search</span>
          </button>

          <button
            className={`sidebar-btn ${mode === "rag" ? "mode-active" : ""}`}
            onClick={() => setMode("rag")}
            style={{
              flex: 1,
              background: mode === "rag" ? "rgba(20, 184, 166, 0.15)" : "rgba(255, 255, 255, 0.04)",
              borderColor: mode === "rag" ? "#14b8a6" : "transparent",
            }}
          >
            <Database size={16} color={mode === "rag" ? "#14b8a6" : "#9ca3af"} />
            <span style={{ color: mode === "rag" ? "#14b8a6" : "#e5e7eb" }}>Knowledge Base</span>
          </button>

          <button
            className={`sidebar-btn ${mode === "hybrid" ? "mode-active" : ""}`}
            onClick={() => setMode("hybrid")}
            style={{
              flex: 1,
              background: mode === "hybrid" ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.04)",
              borderColor: mode === "hybrid" ? "#10b981" : "transparent",
            }}
          >
            <Sparkles size={16} color={mode === "hybrid" ? "#10b981" : "#9ca3af"} />
            <span style={{ color: mode === "hybrid" ? "#10b981" : "#e5e7eb" }}>Hybrid Mode</span>
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="chat-input"
            placeholder="Ask anything or search details..."
            disabled={isSending}
            style={{
              padding: "10px 5px",
            }}
          />

          <button
            onClick={handleSend}
            className="sidebar-btn"
            disabled={isSending || !text.trim()}
            style={{
              width: "48px",
              height: "48px",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: text.trim() ? "linear-gradient(135deg, #60a5fa, #06b6d4)" : "rgba(255, 255, 255, 0.04)",
              cursor: text.trim() && !isSending ? "pointer" : "not-allowed",
              border: "none",
              borderRadius: "12px",
            }}
          >
            <Send size={18} color={text.trim() ? "white" : "#9ca3af"} />
          </button>
        </div>
      </div>
    </div>
  );
}