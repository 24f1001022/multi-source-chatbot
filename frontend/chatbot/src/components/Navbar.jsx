import { Menu } from "lucide-react";
import useChatStore from "../store/chatStore";

export default function Navbar() {
  const toggleSidebar = useChatStore((state) => state.toggleSidebar);

  return (
    <div className="navbar">
      <button
        onClick={toggleSidebar}
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "10px",
          color: "white",
          cursor: "pointer",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Menu size={20} />
      </button>

      <h2
        className="gradient-text"
        style={{ fontWeight: "bold", fontSize: "18px" }}
      >
        MultiSource AI
      </h2>

      {/* Spacer to center title */}
      <div style={{ width: "40px" }} />
    </div>
  );
}