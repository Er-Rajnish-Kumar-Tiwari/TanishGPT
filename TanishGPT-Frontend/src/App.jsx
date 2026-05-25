import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import ChatBox from "./Components/ChatBox";
import Login from "./Pages/Login";
import Community from "./Pages/Community";
import Credits from "./Pages/Credits";
import Loading from "./Pages/Loading";
import { useState } from "react";
import { assets } from "./assets/assets";
import "./assets/prism.css";
import { useAppContext } from "./Context/AppContext";

function App() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAppContext();

  if (pathname === "/loading") {
    return <Loading />
  }

  return (
    <>
      {!isMenuOpen && <img src={assets.menu_icon} alt="Menu Icon" className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden brightness-0 dark:invert" onClick={() => setIsMenuOpen(true)} />}

      {user ? (
        <div className="bg-white text-black dark:bg-gradient-to-b dark:from-[#242124] dark:to-black dark:text-white transition-all duration-300">
          <div className="flex h-screen w-screen">
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

            <Routes>
              <Route path="/" element={<ChatBox />} />
              <Route path="/login" element={<Login />} />
              <Route path="/community" element={<Community />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/loading" element={<Loading />} />
            </Routes>
          </div>
        </div>
      ) :
        (
          <div className="bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen">
            <Login />
          </div>
        )}

    </>
  );
}

export default App;
