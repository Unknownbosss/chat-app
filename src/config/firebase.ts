import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";
import { toast } from "react-toastify";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyDIJR4rcZvHEVHmJoJPIZMM2tEpwcAO1ZA",
  authDomain: "chat-app-ac72a.firebaseapp.com",
  projectId: "chat-app-ac72a",
  storageBucket: "chat-app-ac72a.firebasestorage.app",
  messagingSenderId: "966309323159",
  appId: "1:966309323159:web:43b9b88c75ffab797664d2",
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db = getFirestore(app);
// const analytics: Analytics = getAnalytics(app);

const signUp = async (username: string, email: string, password: string) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey, There I am using chat app",
      lastSeen: Date.now(),
    });

    await setDoc(doc(db, "chats", user.uid), {
      chatsData: [],
    });
  } catch (error: any) {
    console.error("Error during sign up:", error); // Log the entire error
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const login = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};
const resetPass = async (email: string) => {
  if (!email) {
    toast.error("Enter your email");
    return null;
  }

  try {
    const userRef = collection(db, "users");
    const q = query(userRef, where("email", "==", email));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset Email Sent");
    } else {
      toast.error("Email does not exist");
    }
  } catch (error: any) {
    toast.error("error.message");
  }
};

export { signUp, login, logOut, resetPass, auth, db };

/* MINE 
const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyDIJR4rcZvHEVHmJoJPIZMM2tEpwcAO1ZA",
  authDomain: "chat-app-ac72a.firebaseapp.com",
  projectId: "chat-app-ac72a",
  storageBucket: "chat-app-ac72a.firebasestorage.app",
  messagingSenderId: "966309323159",
  appId: "1:966309323159:web:43b9b88c75ffab797664d2",
}; 

his own

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyDmaQyu6sZHep38z8L_eWgjEXfJxMnjLc",
  authDomain: "chat-app-gs-57437.firebaseapp.com",
  projectId: "chat-app-gs-57437",
  storageBucket: "chat-app-gs-57437.appspot.com",
  messagingSenderId: "832124750687",
  appId: "1:832124750687:web:54d2483a0fac54633384ea",
};

*/
