import { Plus, FileText, X, Trash2, Globe, MessageSquare, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useChatStore from "../store/chatStore";

export default function Sidebar() {
  const sidebarOpen = useChatStore((state) => state.sidebarOpen);
  const toggleSidebar = useChatStore((state) => state.toggleSidebar);
  const uploadedFiles = useChatStore((state) => state.uploadedFiles);
  const messages = useChatStore((state) => state.messages);
  const clearChat = useChatStore((state) => state.clearChat);
  const deleteFileFromServer = useChatStore((state) => state.deleteFileFromServer);
  const clearAllFilesFromServer = useChatStore((state) => state.clearAllFilesFromServer);
  const submitMessage = useChatStore((state) => state.submitMessage);
  const isSending = useChatStore((state) => state.isSending);

  const files = uploadedFiles.filter((f) => f.type === "file" || !f.type);
  const websites = uploadedFiles.filter((f) => f.type === "website");

  const handleRecentClick = (text) => {
    if (!isSending) {
      submitMessage(text);
    }
  };

  const SidebarContent = () => (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h1
          className="gradient-text"
          style={{
            fontSize: "24px",
            fontWeight: "800",
            letterSpacing: "-0.5px",
          }}
        >
          MultiSource AI
        </h1>

        <button
          onClick={toggleSidebar}
          className="mobile-close"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={18} />
        </button>
      </div>

      <button
        className="sidebar-btn"
        onClick={clearChat}
        style={{
          background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
          fontWeight: "600",
          border: "none",
        }}
      >
        <Plus size={18} />
        New Chat
      </button>

      {/* Recent Chats */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: "600",
            color: "#94a3b8",
            paddingLeft: "4px",
          }}
        >
          <MessageSquare size={14} />
          Recent Queries
        </div>

        {messages.length === 0 ? (
          <div
            style={{
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.02)",
              fontSize: "13px",
              color: "#64748b",
              textAlign: "center",
            }}
          >
            No history yet
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              maxHeight: "150px",
              overflowY: "auto",
              paddingRight: "2px",
            }}
          >
            {messages
              .filter((msg) => msg.role === "user")
              .slice(-4)
              .reverse()
              .map((msg, index) => (
                <div
                  key={index}
                  onClick={() => handleRecentClick(msg.content)}
                  className="file-card"
                  style={{
                    fontSize: "12px",
                    padding: "10px 12px",
                    cursor: isSending ? "not-allowed" : "pointer",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    margin: 0,
                    color: "#cbd5e1",
                    background: "rgba(255,255,255,0.03)",
                  }}
                  title={msg.content}
                >
                  {msg.content}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Knowledge Base */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "14px",
            fontWeight: "600",
            color: "#94a3b8",
            paddingLeft: "4px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Database size={14} />
            Knowledge Base
          </div>
          {uploadedFiles.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete all files and reset the database?")) {
                  clearAllFilesFromServer();
                }
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "#ef4444",
                fontSize: "11px",
                cursor: "pointer",
                padding: "2px 6px",
                borderRadius: "4px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              Clear DB
            </button>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            overflowY: "auto",
            maxHeight: "calc(100vh - 420px)",
            paddingRight: "2px",
          }}
        >
          {uploadedFiles.length === 0 ? (
            <div
              style={{
                padding: "16px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.02)",
                fontSize: "13px",
                color: "#64748b",
                textAlign: "center",
                border: "1px dashed rgba(255, 255, 255, 0.05)",
              }}
            >
              No documents or links indexed yet. Ingest them on the home screen.
            </div>
          ) : (
            <>
              {/* Documents Subgroup */}
              {files.length > 0 && (
                <div>
                  <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase" }}>
                    Documents ({files.length})
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {files.map((file, idx) => (
                      <motion.div
                        key={`file-${idx}`}
                        whileHover={{ scale: 1.01 }}
                        className="file-card"
                        style={{
                          margin: 0,
                          padding: "10px 12px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background: "rgba(255,255,255,0.03)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "12px",
                            maxWidth: "80%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: "#e2e8f0",
                          }}
                          title={file.name}
                        >
                          <FileText size={14} color="#14b8a6" />
                          {file.name}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFileFromServer(file.name);
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "#64748b",
                            padding: "2px",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "color 0.2s ease",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
                        >
                          <Trash2 size={13} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Websites Subgroup */}
              {websites.length > 0 && (
                <div>
                  <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase" }}>
                    Websites ({websites.length})
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {websites.map((web, idx) => (
                      <motion.div
                        key={`web-${idx}`}
                        whileHover={{ scale: 1.01 }}
                        className="file-card"
                        style={{
                          margin: 0,
                          padding: "10px 12px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background: "rgba(255,255,255,0.03)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "12px",
                            maxWidth: "80%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: "#e2e8f0",
                          }}
                          title={web.name}
                        >
                          <Globe size={14} color="#60a5fa" />
                          {web.name}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFileFromServer(web.name);
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "#64748b",
                            padding: "2px",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "color 0.2s ease",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
                        >
                          <Trash2 size={13} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: "auto",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          paddingTop: "12px",
          opacity: 0.4,
          fontSize: "11px",
          textAlign: "center",
        }}
      >
        MultiSource AI v1.0
      </div>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <div
        className="glass desktop-sidebar"
        style={{
          width: "300px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <SidebarContent />
      </div>

      {/* Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="glass mobile-sidebar"
            style={{
              boxShadow: "10px 0 30px rgba(0,0,0,0.5)",
            }}
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}