import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import Background3D from "../components/Background3D";

export default function Home() {
  return (
    <>
      <Background3D />

      <div className="animated-bg" />

      <div
        style={{
          display: "flex",
          height: "100vh"
        }}
      >
        <Sidebar />
        <ChatWindow />
      </div>
    </>
  );
}