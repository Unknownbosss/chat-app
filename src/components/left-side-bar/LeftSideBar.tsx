import React from "react";
import "./leftsidebar.css";
import assets from "../../assets/assets";

function LeftSideBar() {
  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className="logo" alt="" width={""} />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p>Edit Profile</p>
              <hr />
              <p>Log out</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input type="text" placeholder="search here..." />
        </div>
      </div>
      <div className="ls-list">
        {[...Array(30)].map((item, index) => (
          <div className="friends" key={index}>
            <img src={assets.profile_img} alt="" />
            <div>
              <p>Unknown Boss</p>
              <span>Hello, =how are you </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeftSideBar;
