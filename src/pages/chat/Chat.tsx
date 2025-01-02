import { useContext, useEffect, useState } from "react";
import "./chat.css";
import LeftSideBar from "../../components/left-side-bar/LeftSideBar";
import Chatbox from "../../components/chat-box/Chatbox";
import RightSideBar from "../../components/right-side-bar/RightSideBar";
import { AppContext } from "../../context/AppContext";

function Chat() {
  const [loading, setLoading] = useState<boolean>(true);
  const { chatData, userData } = useContext(AppContext);

  useEffect(() => {
    if (chatData && userData) {
      setLoading(false);
    }
  }, [chatData, userData]);
  return (
    <div className="chat">
      {loading ? (
        <p className="loading">Loading ...</p>
      ) : (
        <div className="chat-container">
          <LeftSideBar />
          <Chatbox />
          <RightSideBar />
        </div>
      )}
    </div>
  );
}

export default Chat;
