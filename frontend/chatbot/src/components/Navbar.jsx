import { Menu } from "lucide-react";
import useChatStore from "../store/chatStore";

export default function Navbar() {
  const toggleSidebar = useChatStore(
    (state) => state.toggleSidebar
  );

  return (
    <div className="navbar">
      <button
        onClick={toggleSidebar}
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          cursor: "pointer"
        }}
      >
        <Menu size={24} />
      </button>

      <h2
        className="gradient-text"
        style={{
          fontWeight: "bold"
        }}
      >
        MultiSource AI
      </h2>
    </div>
  );
}