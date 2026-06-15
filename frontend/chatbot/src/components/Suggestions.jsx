import useChatStore from "../store/chatStore";

export default function Suggestions() {
  const submitMessage = useChatStore((state) => state.submitMessage);
  const isSending = useChatStore((state) => state.isSending);

  const prompts = [
    "Explain LangChain",
    "Summarize uploaded PDF",
    "Latest AI News",
    "Compare RAG and Fine Tuning",
    "Explain Transformers",
    "Generate Interview Questions"
  ];

  return (
    <div className="suggestions">
      {prompts.map((prompt) => (
        <div
          key={prompt}
          className="file-card"
          onClick={() => {
            if (!isSending) {
              submitMessage(prompt);
            }
          }}
          style={{
            cursor: isSending ? "not-allowed" : "pointer",
            opacity: isSending ? 0.6 : 1,
            userSelect: "none"
          }}
        >
          {prompt}
        </div>
      ))}
    </div>
  );
}