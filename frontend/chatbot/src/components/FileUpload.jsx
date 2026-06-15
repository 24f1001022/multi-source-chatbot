import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Globe, Link2, Sparkles } from "lucide-react";

import { uploadFiles, uploadUrl } from "../api/chatApi";
import useChatStore from "../store/chatStore";

export default function FileUpload() {
  const fetchFilesFromServer = useChatStore((state) => state.fetchFilesFromServer);

  const [activeTab, setActiveTab] = useState("file"); // "file" or "url"
  const [urlText, setUrlText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState("info"); // "info", "success", "error"

  const showStatus = (msg, type = "info") => {
    setStatusMessage(msg);
    setStatusType(type);
    setTimeout(() => {
      setStatusMessage(null);
    }, 6000);
  };

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    setIsUploading(true);
    setStatusMessage("Uploading document(s) and indexing...");
    setStatusType("info");

    try {
      const result = await uploadFiles(acceptedFiles);
      await fetchFilesFromServer();
      showStatus(
        `Successfully indexed ${acceptedFiles.length} file(s)! (${result.chunks} chunks created)`,
        "success"
      );
    } catch (err) {
      console.error(err);
      showStatus("Failed to upload/index document(s). Try again.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCrawlUrl = async (e) => {
    e.preventDefault();
    const cleanUrl = urlText.trim();
    if (!cleanUrl) return;

    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      showStatus("URL must start with http:// or https://", "error");
      return;
    }

    setIsUploading(true);
    setStatusMessage(`Crawling ${cleanUrl}...`);
    setStatusType("info");

    try {
      const result = await uploadUrl(cleanUrl);
      if (result.status === "success") {
        await fetchFilesFromServer();
        setUrlText("");
        showStatus(
          `Crawl completed successfully! (${result.chunks} chunks created)`,
          "success"
        );
      } else {
        showStatus(result.message || "Failed to crawl site.", "error");
      }
    } catch (err) {
      console.error(err);
      showStatus("Failed to crawl website. Verify server and internet access.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "text/csv": [".csv"],
    },
    disabled: isUploading,
  });

  return (
    <div
      className="glass"
      style={{
        borderRadius: "24px",
        overflow: "hidden",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        backgroundColor: "rgba(255, 255, 255, 0.02)",
        boxShadow: "0 10px 40px -15px rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          background: "rgba(0, 0, 0, 0.15)",
        }}
      >
        <button
          onClick={() => setActiveTab("file")}
          style={{
            flex: 1,
            padding: "16px",
            border: "none",
            background: activeTab === "file" ? "transparent" : "rgba(0, 0, 0, 0.1)",
            borderBottom: activeTab === "file" ? "2px solid #06b6d4" : "none",
            color: activeTab === "file" ? "#06b6d4" : "#9ca3af",
            fontWeight: activeTab === "file" ? "600" : "400",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <UploadCloud size={16} />
          Upload Files
        </button>

        <button
          onClick={() => setActiveTab("url")}
          style={{
            flex: 1,
            padding: "16px",
            border: "none",
            background: activeTab === "url" ? "transparent" : "rgba(0, 0, 0, 0.1)",
            borderBottom: activeTab === "url" ? "2px solid #60a5fa" : "none",
            color: activeTab === "url" ? "#60a5fa" : "#9ca3af",
            fontWeight: activeTab === "url" ? "600" : "400",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <Globe size={16} />
          Ingest Website
        </button>
      </div>

      {/* Tab Panels */}
      <div style={{ padding: "30px" }}>
        {activeTab === "file" ? (
          <div
            {...getRootProps()}
            style={{
              padding: "40px 20px",
              borderRadius: "16px",
              textAlign: "center",
              cursor: isUploading ? "not-allowed" : "pointer",
              border: `2px dashed ${isDragActive ? "#06b6d4" : "rgba(255, 255, 255, 0.15)"}`,
              background: isDragActive ? "rgba(6, 182, 212, 0.04)" : "rgba(255, 255, 255, 0.01)",
              transition: "all 0.3s ease",
            }}
          >
            <input {...getInputProps()} />
            <UploadCloud
              size={44}
              style={{
                color: isDragActive ? "#06b6d4" : "#9ca3af",
                animation: isUploading ? "pulse 2s infinite" : "none",
                marginBottom: "12px",
              }}
            />
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
              {isDragActive ? "Drop documents here..." : "Drag & drop files here"}
            </h3>
            <p style={{ fontSize: "14px", opacity: 0.6, marginBottom: "4px" }}>
              or click to browse local storage
            </p>
            <span
              style={{
                fontSize: "12px",
                display: "inline-block",
                padding: "2px 8px",
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.05)",
                color: "#cbd5e1",
                marginTop: "10px",
              }}
            >
              PDF • TXT • CSV
            </span>
          </div>
        ) : (
          <form onSubmit={handleCrawlUrl}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                padding: "20px 0",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "600" }}>Crawl and Index Website</h3>
              <p style={{ fontSize: "14px", opacity: 0.6 }}>
                Parse the website content automatically and make it queryable in Docs/Hybrid modes.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  background: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "14px",
                  padding: "6px 12px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <Link2 size={18} color="#60a5fa" style={{ alignSelf: "center" }} />
                <input
                  type="text"
                  placeholder="https://example.com/documentation"
                  value={urlText}
                  onChange={(e) => setUrlText(e.target.value)}
                  disabled={isUploading}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "white",
                    padding: "10px 0",
                    fontSize: "14px",
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={isUploading || !urlText.trim()}
                className="sidebar-btn"
                style={{
                  background: urlText.trim()
                    ? "linear-gradient(135deg, #3b82f6, #60a5fa)"
                    : "rgba(255, 255, 255, 0.04)",
                  color: urlText.trim() ? "white" : "#60a5fa",
                  fontWeight: "600",
                  cursor: urlText.trim() && !isUploading ? "pointer" : "not-allowed",
                  border: "none",
                  marginTop: "5px",
                }}
              >
                {isUploading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Sparkles size={16} style={{ animation: "spin 2s linear infinite" }} />
                    Crawling & Indexing...
                  </span>
                ) : (
                  "Ingest Website"
                )}
              </button>
            </div>
          </form>
        )}

        {/* Status Indicator */}
        {statusMessage && (
          <div
            style={{
              marginTop: "20px",
              padding: "14px",
              borderRadius: "12px",
              fontSize: "14px",
              textAlign: "left",
              border: "1px solid",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background:
                statusType === "success"
                  ? "rgba(16, 185, 129, 0.15)"
                  : statusType === "error"
                  ? "rgba(239, 68, 68, 0.15)"
                  : "rgba(96, 165, 250, 0.15)",
              borderColor:
                statusType === "success"
                  ? "#10b981"
                  : statusType === "error"
                  ? "#ef4444"
                  : "#60a5fa",
              color:
                statusType === "success"
                  ? "#34d399"
                  : statusType === "error"
                  ? "#f87171"
                  : "#93c5fd",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background:
                  statusType === "success"
                    ? "#10b981"
                    : statusType === "error"
                    ? "#ef4444"
                    : "#60a5fa",
                animation: isUploading ? "pulse 1.5s infinite" : "none",
              }}
            />
            <span style={{ flex: 1 }}>{statusMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}