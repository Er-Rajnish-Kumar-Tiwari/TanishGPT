import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Fetch user data
  const fatchUser = () => {
    setUser(dummyUserData);
  };

  // Load user data
  useEffect(() => {
    fatchUser();
  }, []);

  // Fetch  chat data
  const userChats = () => {
    setChats(dummyChats);
    setSelectedChat(dummyChats[0]);
  };

  // Load chat data
  useEffect(() => {
    if (user) {
      userChats();
    } else {
      setSelectedChat(null);
      setChats([]);
    }
  }, [user]);

  // Set theme
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const value = {
    user,
    fatchUser,
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
    navigate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
