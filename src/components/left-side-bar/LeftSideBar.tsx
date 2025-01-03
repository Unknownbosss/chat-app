import React, { useContext, useEffect, useState } from "react";
import "./leftsidebar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { AppContext, ChatData } from "../../context/AppContext";
import { toast } from "react-toastify";

function LeftSideBar() {
  const navigate = useNavigate();
  const {
    userData,
    chatData,
    setMessagesId,
    messagesId,
    chatUser,
    setChatUser,
    chatVisible,
    setChatVisible,
  } = useContext(AppContext);
  const [user, setUser] = useState<DocumentData | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData?.id) {
          let userExist = false;
          chatData?.map((user) => {
            if (user.rId === querySnap.docs[0].data().id) {
              userExist = true;
            }
          });
          if (!userExist) {
            setUser(querySnap.docs[0].data());
          }
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error: any) {}
  };

  const addChat = async () => {
    const messagesRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");
    try {
      const newMessageRef = doc(messagesRef);
      await setDoc(newMessageRef, {
        createAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(chatsRef, user?.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData?.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      await updateDoc(doc(chatsRef, userData?.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user?.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      const uSnap = await getDoc(doc(db, "users", user?.id));
      const uData = uSnap.data();
      if (uData)
        setChat({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user?.id,
          updatedAt: Date.now().toString(),
          messageSeen: true,
          userData: uData,
        });
      setShowSearch(false);
      setChatVisible(true);
    } catch (error: any) {}
  };

  const setChat = async (chat: ChatData) => {
    try {
      setMessagesId(chat.messageId);
      setChatUser(chat);
      if (userData?.id) {
        const userChatRef = doc(db, "chats", userData.id);
        const userChatSnapshot = await getDoc(userChatRef);
        const userChatsData = userChatSnapshot.data();
        const chatIndex = userChatsData?.chatsData.findIndex(
          (c: ChatData) => c.messageId === chat.messageId
        );
        if (userChatsData?.chatsData[chatIndex]) {
          userChatsData.chatsData[chatIndex].messageSeen = true;
          await updateDoc(userChatRef, {
            chatsData: userChatsData.chatsData,
          });
        }
      }
      setChatVisible(true);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const updateChatUserData = async () => {
      if (chatUser) {
        const userRef = doc(db, "users", chatUser.userData.id);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        if (userData) {
          setChatUser((prev) => ({ ...prev, userData }));
        }
      }
    };

    updateChatUserData();
  }, [chatData]);

  return (
    <div className={`ls ${chatVisible ? "hidden" : ""}`}>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className="logo" alt="" width={""} />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p
                onClick={() => {
                  navigate("/profile");
                }}
              >
                Edit Profile
              </p>
              <hr />
              <p>Log out</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input
            onChange={inputHandler}
            type="text"
            placeholder="search here..."
          />
        </div>
      </div>
      <div className="ls-list">
        {showSearch && user ? (
          <div onClick={addChat} className="friends add-user">
            <img
              src={user.avatar ? user.avatar : assets.default_profile}
              alt=""
            />
            <p>{user.name}</p>
          </div>
        ) : (
          chatData?.map((chat, index) => (
            <div
              onClick={() => {
                setChat(chat);
              }}
              className={`friends ${
                chat.messageSeen || chat.messageId === messagesId
                  ? ""
                  : "border"
              }`}
              key={index}
            >
              <img
                src={
                  chat.userData.avatar
                    ? chat.userData.avatar
                    : assets.default_profile
                }
                alt=""
              />
              <div>
                <p>{chat.userData.name}</p>
                <span>{chat.lastMessage} </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LeftSideBar;
