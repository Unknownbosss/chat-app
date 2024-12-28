import React from "react";
import "./rightsidebar.css";
import assets from "../../assets/assets";
import { logOut } from "../../config/firebase";

function RightSideBar() {
  return (
    <div className="rs">
      <div className="rs-profile">
        <img src={assets.profile_img} alt="" />
        <h3>
          Unknown Boss
          <img src={assets.green_dot} alt="" />
        </h3>
        <p>Hey. There i am using this app</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div>
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic3} alt="" />
          <img src={assets.pic4} alt="" />
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
        </div>
      </div>
      <button onClick={() => logOut()}>Log Out</button>
    </div>
  );
}

export default RightSideBar;
