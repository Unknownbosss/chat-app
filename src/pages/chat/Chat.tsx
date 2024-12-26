import React from "react";
import "./chat.css";
import LeftSideBar from "../../components/left-side-bar/LeftSideBar";
import Chatbox from "../../components/chat-box/Chatbox";
import RightSideBar from "../../components/right-side-bar/RightSideBar";

function Chat() {
  return (
    <div className="chat">
      <div className="chat-container">
        <LeftSideBar />
        <Chatbox />
        <RightSideBar />
      </div>
    </div>
  );
}

export default Chat;
