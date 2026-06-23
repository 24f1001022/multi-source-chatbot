import Navbar from "./Navbar";
import Message from "./Message";
import PromptBox from "./PromptBox";
import FileUpload from "./FileUpload";
import Suggestions from "./Suggestions";
import useChatStore from "../store/chatStore";

export default function ChatWindow() {
  const messages = useChatStore((state) => state.messages);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>

      <Navbar />

      <div style={{ flex: 1, overflowY: "auto", padding: "clamp(16px, 4vw, 40px)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

          {messages.length === 0 ? (
            <>
              <h1
                className="gradient-text"
                style={{
                  textAlign: "center",
                  fontSize: "clamp(36px, 8vw, 72px)",
                  marginTop: "clamp(30px, 6vh, 80px)",
                  lineHeight: 1.1,
                }}
              >
                Multi Source AI
              </h1>

              <p style={{ textAlign: "center", opacity: 0.7, marginTop: "12px", fontSize: "clamp(13px, 2vw, 15px)", padding: "0 16px" }}>
                Search the Web. Analyze Documents. Chat with Knowledge.
              </p>

              <div style={{ marginTop: "clamp(24px, 4vh, 50px)" }}>
                <FileUpload />
              </div>

              <Suggestions />
            </>
          ) : (
            messages.map((msg, index) => (
              <Message
                key={index}
                role={msg.role}
                content={msg.content}
                sources={msg.sources}
                web_results={msg.web_results}
              />
            ))
          )}

        </div>
      </div>

      <PromptBox />

    </div>
  );
}