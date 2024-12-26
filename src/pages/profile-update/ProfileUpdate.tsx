import React, { useState } from "react";
import "./profileUpdate.css";
import assets from "../../assets/assets";

function ProfileUpdate() {
  const [image, setImage] = useState<File | null>(null)

  return <div className="profile">
    <div className="profile-container">
      <form >
        <h3>Profile Details</h3>
        <label htmlFor="avatar">
          <input onChange={(e) => {
            if (e.target.files) {
              setImage(e.target.files[0]);
            }
          }} type="file" id="avatar" accept=".png, .jpg, .jpeg" hidden />
          <img src={image ? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
          Upload Profile Image
        </label>
        <input type="text" placeholder="Your name" required />
        <textarea placeholder="Write Profile Bio" required> </textarea>
        <button type="submit">Save</button>
      </form>
      <img src={image ? URL.createObjectURL(image) : assets.logo_icon} alt="" className="profile-pic" />
    </div>
  </div>;
}

export default ProfileUpdate;
