import { Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Chat from "./pages/chat/Chat";
import ProfileUpdate from "./pages/profile-update/ProfileUpdate";

function App() {
  return (
    <>
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
