import React, { useContext, useEffect, useState } from "react";
import "./profileUpdate.css";
import assets from "../../assets/assets";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { AppContext, UserData } from "../../context/AppContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import upload from "../../libs/upload";

function ProfileUpdate() {
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [uid, setUid] = useState<string>("");
  const [prevImage, setPrevImage] = useState<string>("");
  const navigate = useNavigate();
  const { setUserData } = useContext(AppContext);

  const profileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!prevImage && !image) {
        toast.error("Upload Profile Picture");
      }
      const docRef = doc(db, "users", uid);
      if (image) {
        const imageUrl = await upload(image);
        setPrevImage(imageUrl);
        await updateDoc(docRef, {
          avatar: imageUrl,
          bio,
          name,
        });
      } else {
        await updateDoc(docRef, {
          bio,
          name,
        });
      }
      const snap = await getDoc(docRef);
      const userData = snap.data() as UserData;
      setUserData(userData);
      navigate("/chat");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          if (docSnap.data().name) {
            setName(docSnap.data().name);
          }
          if (docSnap.data().bio) {
            setBio(docSnap.data().bio);
          }
          if (docSnap.data().avatar) {
            setPrevImage(docSnap.data().avatar);
          }
        }
      } else {
        navigate("/");
      }
    });
  }, []);

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input
              onChange={(e) => {
                if (e.target.files) {
                  setImage(e.target.files[0]);
                }
              }}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={image ? URL.createObjectURL(image) : assets.avatar_icon}
              alt=""
            />
            Upload Profile Image
          </label>
          <input
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
            type="text"
            placeholder="Your name"
            required
          />
          <textarea
            onChange={(e) => {
              setBio(e.target.value);
            }}
            value={bio}
            placeholder="Write Profile Bio"
            required
          ></textarea>
          <button type="submit">Save</button>
        </form>
        <img
          src={
            image
              ? URL.createObjectURL(image)
              : prevImage
              ? prevImage
              : assets.logo_icon
          }
          alt=""
          className="profile-pic"
        />
      </div>
    </div>
  );
}

export default ProfileUpdate;
