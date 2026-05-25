import React, { useContext, useEffect, useRef, useState } from 'react'
import { useAppContext } from '../Context/AppContext';
import { assets } from '../assets/assets';
import Message from './Message';

const ChatBox = () => {

  const {theme,selectedChat,loading ,setLoading} = useAppContext();
  const [messages, setMessages]=useState([]);
  const [prompt, setPrompt] = useState("");
  const [mode , setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);
  const containerRef = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();
    if (prompt) {
      const message = {
        role: "user",
        content: prompt,
        timestamp: Date.now(),
      };
      setMessages((prevMessages) => [...prevMessages, message]);
      setPrompt("");
    }
  };

  useEffect(()=>{
    if(selectedChat){
      setMessages(selectedChat.messages);
    }
  },[selectedChat]);

useEffect(() => {
  if (containerRef.current) {
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }
}, [messages]);

  return (

    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40 '>

      <div className='flex-1 mb-5 overflow-y-scroll' ref={containerRef}>

        {messages.length === 0 && (
          <div className='h-full flex flex-col items-center justify-center gap-2 text-primary'>
            <img src={theme === "dark" ? assets.logo_full : assets.logo_full_dark} alt="Logo" className="w-full max-w-56 sm:max-w-68"/>
            <p className='mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white'>Ask me anything.</p>
          </div>
        )}

        {messages.map((message, index) => <Message key={index} message={message}/>)}

        {loading && <div className='loader flex items-center gap-1.5'>
          <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce '></div>
          <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce '></div>
          <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce '></div>
        </div>}

      </div>

      {mode === "image" && (
        <label className='inline-flex items-center gap-2 mb-3 text-sm mx-auto'>
          <p className='text-xs'>Publish generated image to community </p>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className='cursor-pointer'
          />
        </label>
      )}

      <form
        className='bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center'
        onSubmit={onSubmit}
      >

        <select
          className='text-sm pl-3 pr-2 outline-none bg-transparent text-black dark:text-white dark:bg-transparent'
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="text" className='bg-white dark:bg-purple-900 text-black dark:text-white'>
            Text
          </option>
          <option value="image" className='bg-white dark:bg-purple-900 text-black dark:text-white'>
            Image
          </option>
        </select>

        <input
          type="text"
          placeholder='Type your message here...'
          className='flex-1 w-full text-sm outline-none bg-transparent text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-300'
          required
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          type='submit'
          className='text-white px-3 py-1 rounded-md text-sm'
        >
          <img
            src={loading ? assets.stop_icon : assets.send_icon}
            alt="Send Icon"
            className="w-8 cursor-pointer"
          />
        </button>

      </form>

    </div>

  )
}

export default ChatBox