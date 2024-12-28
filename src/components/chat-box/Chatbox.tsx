import React, { useContext, useEffect, useState } from "react";
import "./chatbox.css";
import assets from "../../assets/assets";
import { AppContext, ChatData } from "../../context/AppContext";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";

function Chatbox() {
  const { userData, messagesId, chatUser, messages, setMessages } =
    useContext(AppContext);
  const [input, setInput] = useState<string>("");

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
    setInput('')
  };

  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, "messages", messagesId), (res) => {
        if (res) {
          setMessages(res.data()?.messages.reverse());
          console.log(res.data()?.messages.reverse());
        }
      });

      return () => {
        unSub();
      };
    }
  }, [messagesId]);

  return chatUser ? (
    <div className="chat-box">
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt="" />
        <p>
          {chatUser.userData.name}
          <img src={assets.green_dot} alt="" className="dot" />
        </p>
        <img src={assets.help_icon} className="help" alt="" />
      </div>

      <div className="chat-msg">
        <div className="s-msg">
          <p className="msg">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem modi
            illo dignissimos maiores in optio ut ducimus architecto quisquam
            soluta sapiente omnis dolorum expedita, reprehenderit error eum
            voluptates pariatur aspernatur!
          </p>
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2: 30</p>
          </div>
        </div>

        <div className="s-msg">
          <img src={assets.pic1} alt="" className="msg-img" />
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2: 30</p>
          </div>
        </div>

        <div className="r-msg">
          <p className="msg">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem modi
            illo dignissimos maiores in optio ut ducimus architecto quisquam
            soluta sapiente omnis dolorum expedita, reprehenderit error eum
            voluptates pariatur aspernatur!
          </p>
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2: 30</p>
          </div>
        </div>
      </div>

      <div className="chat-input">
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Send a message"
        />
        <input type="file" id="image" accept="image/png, image/jpeg" hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sendMessage} src={assets.send_button} alt="" />
      </div>
    </div>
  ) : (
    <div className="chat-welcome">
      <img src={assets.logo_icon} alt="" />
      <p>Chat Anytime, Anywhere</p>
    </div>
  );
}

export default Chatbox;
