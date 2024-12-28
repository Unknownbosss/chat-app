import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Chat from "./pages/chat/Chat";
import ProfileUpdate from "./pages/profile-update/ProfileUpdate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import { AppContext } from "./context/AppContext";

function App() {
  const navigate = useNavigate();
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("AppContext must be used within an AppContextProvider");
  }

  const { loadUserData } = context;

  if (typeof loadUserData !== "function") {
    throw new Error("loadUserData is not a function");
  }

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        navigate("/chat");
        await loadUserData(user.uid);
        console.log(user);
      } else {
        navigate("/");
      }
    });
  }, []);
  return (
    <>
      <ToastContainer position="top-center"/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<ProfileUpdate />} />
        <Route path="*" element={<h2>404 not found</h2>} />
      </Routes>
    </>
  );
}

export default App;
