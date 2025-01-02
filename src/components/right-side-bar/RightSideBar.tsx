import React, { useContext, useEffect, useState } from "react";
import "./rightsidebar.css";
import assets from "../../assets/assets";
import { logOut } from "../../config/firebase";
import { AppContext, ChatData } from "../../context/AppContext";

function RightSideBar() {
  const { chatUser, messages } = useContext(AppContext);
  const [msgImgs, setMsgImgs] = useState<string[]>([]);

  useEffect(() => {
    let tempVal: string[] = [];
    messages.map((msg) => {
      if (msg.image) {
        tempVal.push(msg.image);
      }
    });
    setMsgImgs(tempVal);
  }, [messages]);

  return chatUser ? (
    <div className="rs">
      <div className="rs-profile">
        <img src={chatUser.userData.avatar} alt="" />
        <h3>
          {chatUser.userData.name}
          {Date.now() - chatUser.userData.lastSeen < +70_000 ? (
            <img src={assets.green_dot} alt="" className="dot" />
          ) : null}
        </h3>
        <p>{chatUser.userData.bio}</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div>
          {msgImgs.map((imgUrl, i) => (
            <img
              src={imgUrl}
              alt=""
              key={i}
              onClick={() => window.open(imgUrl)}
            />
          ))}
        </div>
      </div>
      <button onClick={() => logOut()}>Log Out</button>
    </div>
  ) : (
    <div className="rs">
      <button onClick={() => logOut()}>LogOut</button>
    </div>
  );
}

export default RightSideBar;
