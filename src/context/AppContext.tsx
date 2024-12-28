import { doc, DocumentData, getDoc, updateDoc } from "firebase/firestore";
import { Context, createContext, ReactNode, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

interface AppContextType {
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  chatData: ChatData | null;
  setChatData: (data: ChatData | null) => void;
  loadUserData: (uid: string) => Promise<void>; // Ensure this is defined
}

// Create a default context value
const defaultContextValue: AppContextType = {
  userData: null,
  setUserData: () => {}, // Provide a no-op function
  chatData: null,
  setChatData: () => {}, // Provide a no-op function
  loadUserData: async () => {}, // Provide a no-op function
};

// Create the context with a default value
export const AppContext: Context<AppContextType> = createContext(defaultContextValue);

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
interface ChatData {}

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null | DocumentData>(
    null
  );
  const [chatData, setChatData] = useState<ChatData | null>(null);
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
  //2:43

  // Initialize the context value
  const value: any = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
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
