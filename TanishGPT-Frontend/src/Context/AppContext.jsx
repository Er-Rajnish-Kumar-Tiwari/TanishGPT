import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  // ========================
  // FETCH USER
  // ========================
  const fetchUser = async () => {
    try {
      const res = await axios.get("/user/data", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data.user);
    } catch (error) {
      toast.error(error.message);
      setUser(null);
    }
  };

  // ========================
  // FETCH CHATS
  // ========================
  const fetchUserChats = async () => {
    try {
      if (!token) return;

      const res = await axios.get("/chat/get", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const chatsData = res.data.chats || [];
      setChats(chatsData);

      if (chatsData.length > 0) {
        setSelectedChat(chatsData[0]);
      } else {
        // create new chat if none exists
        const createRes = await axios.post(
          "/chat/create",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const newChats = await axios.get("/chat/get", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setChats(newChats.data.chats || []);
        setSelectedChat(newChats.data.chats?.[0] || null);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ========================
  // CREATE CHAT (manual)
  // ========================
  const createChat = async () => {
    try {
      if (!user) return toast.error("Please login to create a chat");

      await axios.post(
        "/chat/create",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await fetchUserChats();
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ========================
  // LOAD USER ON TOKEN CHANGE
  // ========================
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
      setChats([]);
      setSelectedChat(null);
    }
  }, [token]);

  // ========================
  // LOAD CHATS ON USER
  // ========================
  useEffect(() => {
    if (user && token) {
      fetchUserChats();
    } else {
      setChats([]);
      setSelectedChat(null);
    }
  }, [user, token]);

  // ========================
  // THEME HANDLING
  // ========================
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // ========================
  // CONTEXT VALUE
  // ========================
  const value = {
    user,
    setUser,

    chats,
    setChats,

    loading,
    setLoading,

    error,
    setError,

    selectedChat,
    setSelectedChat,

    theme,
    setTheme,

    token,
    setToken,

    navigate,
    axios,
    toast,

    createChat,
    fetchUserChats,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);