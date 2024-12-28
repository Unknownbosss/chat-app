import React, { useContext, useState } from "react";
import "./leftsidebar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import {
  collection,
  DocumentData,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { AppContext } from "../../context/AppContext";

function LeftSideBar() {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
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
          setUser(querySnap.docs[0].data());
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error: any) {}
  };

  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className="logo" alt="" width={""} />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
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
          <div className="friends add-user">
            <img src={user.avatar} alt="" />
            <p>{user.name}</p>
          </div>
        ) : (
          [...Array(30)].map((item, index) => (
            <div className="friends" key={index}>
              <img src={assets.profile_img} alt="" />
              <div>
                <p>Unknown Boss</p>
                <span>Hello, =how are you </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LeftSideBar;
