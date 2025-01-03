import React, { useContext, useEffect, useRef, useState } from "react";
import "./chatbox.css";
import assets from "../../assets/assets";
import { AppContext, ChatData } from "../../context/AppContext";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";
import upload from "../../libs/upload";

function Chatbox() {
  const {
    userData,
    messagesId,
    chatUser,
    messages,
    setMessages,
    chatVisible,
    setChatVisible,
    profileVisible,
    setProfileVisible,
  } = useContext(AppContext);
  const [input, setInput] = useState<string>("");
  const ref = useRef<HTMLInputElement>(null);

  const sendMessage = async () => {
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData?.id,
            text: input,
            createdAt: new Date(),
          }),
        });

        const userIds = [chatUser?.rId, userData?.id];

        userIds.forEach(async (id) => {
          if (id) {
            const userChatsRef = doc(db, "chats", id);

            const userChatsSnapshot = await getDoc(userChatsRef);

            if (userChatsSnapshot.exists()) {
              const userChatData = userChatsSnapshot.data();
              const chatIndex = userChatData.chatsData.findIndex(
                (c: ChatData) => c.messageId === messagesId
              );
              userChatData.chatsData[chatIndex].lastMessage = input.slice(
                0,
                30
              );
              userChatData.chatsData[chatIndex].updatedAt = Date.now();
              if (userChatData.chatsData[chatIndex].rId === userData?.id) {
                userChatData.chatsData[chatIndex].messageSeen = false;
              }
              await updateDoc(userChatsRef, {
                chatsData: userChatData.chatsData,
              });
            }
          }
        });
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    setInput("");
    ref.current?.focus();
  };

  const sendImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      let fileUrl;
      if (e.target.files) {
        fileUrl = await upload(e.target.files[0]);
      }

      if (fileUrl && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData?.id,
            image: fileUrl,
            createdAt: new Date(),
          }),
        });

        const userIds = [chatUser?.rId, userData?.id];

        userIds.forEach(async (id) => {
          if (id) {
            const userChatsRef = doc(db, "chats", id);

            const userChatsSnapshot = await getDoc(userChatsRef);

            if (userChatsSnapshot.exists()) {
              const userChatData = userChatsSnapshot.data();
              const chatIndex = userChatData.chatsData.findIndex(
                (c: ChatData) => c.messageId === messagesId
              );
              userChatData.chatsData[chatIndex].lastMessage = "Image";
              userChatData.chatsData[chatIndex].updatedAt = Date.now();
              if (userChatData.chatsData[chatIndex].rId === userData?.id) {
                userChatData.chatsData[chatIndex].messageSeen = false;
              }
              await updateDoc(userChatsRef, {
                chatsData: userChatData.chatsData,
              });
            }
          }
        });
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const convertTimeStamp = (timestamp: Timestamp) => {
    let date = timestamp.toDate();
    const hour = date.getHours();
    const mins = date.getMinutes();
    if (hour > 12) {
      return hour - 12 + ":" + mins + "PM";
    } else {
      return hour + ":" + mins + "AM";
    }
  };

  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, "messages", messagesId), (res) => {
        if (res) {
          setMessages(res.data()?.messages.reverse());
        }
      });

      return () => {
        unSub();
      };
    }
  }, [messagesId]);

  return chatUser ? (
    <div
      className={`chat-box ${chatVisible && !profileVisible ? "" : "hidden"}`}
    >
      <div className="chat-user">
        <img
          src={
            chatUser.userData.avatar
              ? chatUser.userData.avatar
              : assets.default_profile
          }
          alt=""
          onClick={() => {
            setProfileVisible(true);
          }}
        />
        <p
          onClick={() => {
            setProfileVisible(true);
          }}
        >
          {chatUser.userData.name}
          {Date.now() - chatUser.userData.lastSeen < +70_000 ? (
            <img src={assets.green_dot} alt="" className="dot" />
          ) : null}
        </p>
        <img src={assets.help_icon} className="help" alt="" />
        <img
          onClick={() => {
            setChatVisible(false);
          }}
          src={assets.arrow_icon}
          alt=""
          className="arrow"
        />
      </div>

      <div className="chat-msg">
        {messages.map((msg, i) => (
          <div className={msg.sId === userData?.id ? "s-msg" : "r-msg"} key={i}>
            {msg.image ? (
              <img className="msg-img" src={msg.image} alt="" />
            ) : (
              <p className="msg">{msg.text}</p>
            )}

            <div>
              <img
                src={
                  msg.sId === userData?.id
                    ? userData.avatar
                      ? chatUser.userData.avatar
                      : assets.default_profile
                    : chatUser.userData.avatar
                    ? chatUser.userData.avatar
                    : assets.default_profile
                }
                alt=""
              />
              <p>{convertTimeStamp(msg.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          ref={ref}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          value={input}
          type="text"
          placeholder="Send a message"
        />
        <input
          onChange={sendImage}
          type="file"
          id="image"
          accept="image/png, image/jpeg"
          hidden
        />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sendMessage} src={assets.send_button} alt="" />
      </div>
    </div>
  ) : (
    <div className={`chat-welcome ${chatVisible ? "" : "hidden"}`}>
      <img src={assets.logo_icon} alt="" />
      <p>Chat Anytime, Anywhere</p>
    </div>
  );
}

export default Chatbox;
