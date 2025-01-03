import {
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { Context, createContext, ReactNode, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

interface AppContextType {
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  chatData: ChatData[];
  setChatData: (data: ChatData[]) => void;
  loadUserData: (uid: string) => Promise<void>;
  messages: MessageType[];
  setMessages: (data: MessageType[]) => void;
  messagesId: string;
  setMessagesId: (data: string) => void;
  chatUser: ChatData | null; // Add this property
  setChatUser: (
    data: ChatData | ((prevState: ChatData) => ChatData | null)
  ) => void;
  chatVisible: boolean;
  setChatVisible: (data: boolean) => void; // Add this property
  profileVisible: boolean;
  setProfileVisible: (data: boolean) => void; // Add this property
}

// Create a default context value
const defaultContextValue: AppContextType = {
  userData: null,
  setUserData: () => {}, // Provide a no-op function
  chatData: [], // Initialize as an empty array
  setChatData: () => {}, // Provide a no-op function
  loadUserData: async () => {}, // Provide a no-op function
  messages: [], // Initialize as an empty array
  setMessages: () => {}, // Provide a no-op function
  messagesId: "", // Initialize as an empty array
  setMessagesId: () => {}, // Provide a no-op function
  chatUser: null, // Initialize chatUser as null
  setChatUser: () => {}, // Provide a no-op function
  chatVisible: false, // Initialize chatUser as null
  setChatVisible: () => {}, // Provide a no-op function
  profileVisible: false, // Initialize chatUser as null
  setProfileVisible: () => {}, // Provide a no-op function
};

// Create the context with a default value
export const AppContext: Context<AppContextType> =
  createContext(defaultContextValue);

// Define the provider component
interface AppContextProviderProps {
  children: ReactNode;
}

export interface UserData {
  avatar: string;
  bio: string;
  email: string;
  id: string;
  lastSeen: number;
  name: string;
  username: string;
}
export interface ChatData {
  lastMessage: string;
  messageId: string;
  rId: string;
  updatedAt: string;
  userData: UserData | DocumentData;
  messageSeen: boolean;
}

export interface MessageType {
  sId: string;
  text: string;
  createdAt: Timestamp;
  image: string;
}

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null | DocumentData>(
    null
  );
  const [chatData, setChatData] = useState<ChatData[]>([]);
  const [messagesId, setMessagesId] = useState<string | null>(null);
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [chatVisible, setChatVisible] = useState<boolean>(false);
  const [profileVisible, setProfileVisible] = useState<boolean>(false);

  const loadUserData = async (uid: string) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      if (userData) setUserData(userData);
      if (userData?.avatar && userData?.name) {
        navigate("/chat");
      } else {
        navigate("/profile");
      }
      await updateDoc(userRef, {
        lastSeen: Date.now(),
      });
      setInterval(async () => {
        if (auth.currentUser) {
          await updateDoc(userRef, {
            lastSeen: Date.now(),
          });
        }
      }, 60_000);
    } catch (error) {}
  };

  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, "chats", userData.id);
      const unSub = onSnapshot(chatRef, async (res) => {
        const chatData = res.data();
        if (chatData) {
          const chatItems = chatData.chatsData;
          const tempData = [];
          for (const item of chatItems) {
            const userRef = doc(db, "users", item.rId);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            tempData.push({ ...item, userData });
          }
          setChatData(
            tempData.sort((a, b) => {
              return b.updatedAt - a.updatedAt;
            })
          );
        }
      });
      return () => {
        unSub();
      };
    }
  }, [userData]);

  // Initialize the context value
  const value: any = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
    messages,
    setMessages,
    messagesId,
    setMessagesId,
    chatUser,
    setChatUser,
    chatVisible,
    setChatVisible,
    profileVisible,
    setProfileVisible,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;

/*
{
    "uid": "LNwe2a5mLxUpfjL34meJU1ewpBs1",
    "email": "test@gmail.com",
    "emailVerified": false,
    "isAnonymous": false,
    "providerData": [
        {
            "providerId": "password",
            "uid": "test@gmail.com",
            "displayName": null,
            "email": "test@gmail.com",
            "phoneNumber": null,
            "photoURL": null
        }
    ],
    "stsTokenManager": {
        "refreshToken": "AMf-vBwkGtfhmkFL16B1UgPV2EISTosJnGuV96NZjBirQpO4wsnagNyZ4oP9eYsHgjRahW2l-X03W1I6_oqSUebOUPHHe8jKx40xYKTG_3L4plCUb0zPBl8Q6jy9i_Hs48HshsFcIgN7W0HuTWFdO3RuaA8xZVPCPP8hQpHIZUoSw4qMQoxgQbpNY3vLPSEIPVbA3z4HPB3x9b0ZadxrfUHzdaB0AW4b0Q",
        "accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImMwYTQwNGExYTc4ZmUzNGM5YTVhZGU5NTBhMjE2YzkwYjVkNjMwYjMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2hhdC1hcHAtYWM3MmEiLCJhdWQiOiJjaGF0LWFwcC1hYzcyYSIsImF1dGhfdGltZSI6MTczNTMyODYwNywidXNlcl9pZCI6IkxOd2UyYTVtTHhVcGZqTDM0bWVKVTFld3BCczEiLCJzdWIiOiJMTndlMmE1bUx4VXBmakwzNG1lSlUxZXdwQnMxIiwiaWF0IjoxNzM1MzMzMzM0LCJleHAiOjE3MzUzMzY5MzQsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.LdVuRvpuEBJBl6UbVVjYMiuqaXSsQap_RD4lFXXPQj3XFG5RJPxJyIOfhl10MWTdAjKH6f1ZxfVr7RJ6ve6MVoT4AbVr4248mx74xkhThyeqw5IUewPsPddpCLYkqZxtiQdnfXGOI5BHFlfYTuMm5MGcfn0qXI29hgMdBQd2WZ_IDB7c6um_2-Ewkaf-fuQjKmoyAGPb3AVd5KdlxGpUA2rgr9w_fXQShlLHtuyxi-X5Uh20OOsNaJY8iTM4RtF1rjiChegyCSC7nhKl_Dl600tk2ksaED2aXzUi5Ovqa-CYEleoZW2568DkFB1-Q_IV6NESh2o4tILW18Ot5i8ksw",
        "expirationTime": 1735336942201
    },
    "createdAt": "1735327512584",
    "lastLoginAt": "1735328607310",
    "apiKey": "AIzaSyDIJR4rcZvHEVHmJoJPIZMM2tEpwcAO1ZA",
    "appName": "[DEFAULT]"
}

*/
