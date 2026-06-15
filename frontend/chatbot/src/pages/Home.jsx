import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import Background3D from "../components/Background3d"; // Verify casing matching Background3d.jsx
import useChatStore from "../store/chatStore";

export default function Home() {
  const fetchFilesFromServer = useChatStore(
    (state) => state.fetchFilesFromServer
  );

  useEffect(() => {
    fetchFilesFromServer();
  }, [fetchFilesFromServer]);

  return (
    <>
      <Background3D />

      <div className="animated-bg" />

      <div
        style={{
          display: "flex",
          height: "100vh",
          overflow: "hidden"
        }}
      >
        <Sidebar />

        <ChatWindow />
      </div>
    </>
  );
}