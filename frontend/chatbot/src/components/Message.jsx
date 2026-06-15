import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Globe,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from "lucide-react";

export default function Message({
  role,
  content,
  sources = [],
  web_results = [],
}) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [expandedSourceIndex, setExpandedSourceIndex] = useState(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSourceFilename = (srcPath) => {
    if (!srcPath) return "Unknown Document";
    return srcPath.split(/[/\\]/).pop();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        marginBottom: "28px",
        width: "100%",
      }}
    >
      {/* Message Bubble */}
      <div
        className="glass"
        style={{
          position: "relative",
          maxWidth: "85%",
          minWidth: "100px",
          padding: "20px 24px",
          borderRadius: isUser ? "24px 24px 4px 24px" : "24px 24px 24px 4px",
          background: isUser
            ? "rgba(6, 182, 212, 0.12)"
            : "rgba(255, 255, 255, 0.03)",
          border: isUser
            ? "1px solid rgba(6, 182, 212, 0.2)"
            : "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: isUser
            ? "0 4px 20px -5px rgba(6, 182, 212, 0.15)"
            : "0 4px 20px -5px rgba(0, 0, 0, 0.3)",
          color: "#f1f5f9",
          fontSize: "15px",
          lineHeight: "1.6",
        }}
      >
        {/* Copy Button (only for Assistant or non-empty messages) */}
        {!isUser && content && (
          <button
            onClick={handleCopy}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#9ca3af",
              opacity: 0.4,
              padding: "4px",
              transition: "opacity 0.2s ease, color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.4";
              e.currentTarget.style.color = "#9ca3af";
            }}
            title="Copy response"
          >
            {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
          </button>
        )}

        <div className="markdown-content">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>

      {/* RAG Sources (Document References) */}
      {!isUser && sources && sources.length > 0 && (
        <div
          style={{
            marginTop: "10px",
            width: "85%",
            alignSelf: "flex-start",
          }}
        >
          <button
            onClick={() => setShowSources(!showSources)}
            style={{
              background: "transparent",
              border: "none",
              color: "#14b8a6",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 8px",
              borderRadius: "8px",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(20, 184, 166, 0.08)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <FileText size={14} />
            {showSources ? "Hide Sources" : `View Sources (${sources.length})`}
            {showSources ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <AnimatePresence>
            {showSources && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  overflow: "hidden",
                  marginTop: "8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {sources.map((src, idx) => {
                  const filename = getSourceFilename(src.metadata?.source);
                  const isExpanded = expandedSourceIndex === idx;

                  return (
                    <div
                      key={idx}
                      className="glass"
                      style={{
                        borderRadius: "12px",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        background: "rgba(255, 255, 255, 0.01)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        onClick={() =>
                          setExpandedSourceIndex(isExpanded ? null : idx)
                        }
                        style={{
                          padding: "10px 14px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer",
                          background: isExpanded
                            ? "rgba(20, 184, 166, 0.04)"
                            : "transparent",
                          transition: "background 0.2s ease",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "13px",
                            fontWeight: "500",
                            color: "#e2e8f0",
                          }}
                        >
                          <FileText size={13} color="#14b8a6" />
                          <span>{filename}</span>
                          {src.metadata?.page !== undefined && (
                            <span
                              style={{
                                fontSize: "11px",
                                opacity: 0.5,
                                background: "rgba(255,255,255,0.06)",
                                padding: "1px 6px",
                                borderRadius: "4px",
                              }}
                            >
                              Page {src.metadata.page + 1}
                            </span>
                          )}
                        </div>
                        {isExpanded ? (
                          <ChevronUp size={14} color="#94a3b8" />
                        ) : (
                          <ChevronDown size={14} color="#94a3b8" />
                        )}
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            style={{ overflow: "hidden" }}
                          >
                            <div
                              style={{
                                padding: "12px 14px",
                                borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                                fontSize: "12px",
                                color: "#94a3b8",
                                lineHeight: "1.5",
                                background: "rgba(0, 0, 0, 0.1)",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {src.page_content}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Web Search Results */}
      {!isUser && web_results && web_results.length > 0 && (
        <div
          style={{
            marginTop: "12px",
            width: "85%",
            alignSelf: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontWeight: "600",
              color: "#60a5fa",
              marginBottom: "8px",
              paddingLeft: "6px",
            }}
          >
            <Globe size={14} />
            Search References ({web_results.length})
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "10px",
            }}
          >
            {web_results.map((res, idx) => (
              <a
                key={idx}
                href={res.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass source-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  background: "rgba(255, 255, 255, 0.01)",
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(96, 165, 250, 0.4)";
                  e.currentTarget.style.background = "rgba(96, 165, 250, 0.03)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.01)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#e2e8f0",
                      marginBottom: "6px",
                      lineHeight: "1.4",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {res.title || "Web Search Result"}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#94a3b8",
                      lineHeight: "1.4",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      marginBottom: "8px",
                    }}
                  >
                    {res.body || "View search snapshot details."}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "10px",
                    fontWeight: "500",
                    color: "#60a5fa",
                    alignSelf: "flex-start",
                  }}
                >
                  <span>{new URL(res.href).hostname}</span>
                  <ExternalLink size={10} />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}