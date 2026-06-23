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
    <div className="prompt-wrapper">
      <div
        className="glass"
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          borderRadius: "20px",
          padding: "12px",
          boxShadow: "0 10px 30px -10px rgba(0,0,0,0.7)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Mode Buttons */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
          {[
            { key: "web", label: "Web", icon: Globe, color: "#60a5fa", bg: "rgba(96,165,250,0.15)" },
            { key: "rag", label: "Docs", icon: Database, color: "#14b8a6", bg: "rgba(20,184,166,0.15)" },
            { key: "hybrid", label: "Hybrid", icon: Sparkles, color: "#10b981", bg: "rgba(16,185,129,0.15)" },
          ].map(({ key, label, icon: Icon, color, bg }) => (
            <button
              key={key}
              className={`sidebar-btn ${mode === key ? "mode-active" : ""}`}
              onClick={() => setMode(key)}
              style={{
                flex: 1,
                background: mode === key ? bg : "rgba(255,255,255,0.04)",
                borderColor: mode === key ? color : "transparent",
                padding: "10px 4px",
              }}
            >
              <Icon size={15} color={mode === key ? color : "#9ca3af"} />
              <span className="mode-label" style={{ color: mode === key ? color : "#e5e7eb", fontSize: "12px" }}>
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Input Row */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
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
            placeholder="Ask anything..."
            disabled={isSending}
            style={{ padding: "10px 6px", fontSize: "15px" }}
          />
          <button
            onClick={handleSend}
            className="sidebar-btn"
            disabled={isSending || !text.trim()}
            style={{
              width: "44px",
              height: "44px",
              minWidth: "44px",
              padding: 0,
              background: text.trim() ? "linear-gradient(135deg, #60a5fa, #06b6d4)" : "rgba(255,255,255,0.04)",
              cursor: text.trim() && !isSending ? "pointer" : "not-allowed",
              border: "none",
              borderRadius: "12px",
              flexShrink: 0,
            }}
          >
            <Send size={17} color={text.trim() ? "white" : "#9ca3af"} />
          </button>
        </div>
      </div>
    </div>
  );
}