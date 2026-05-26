import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment/moment'
import Markdown from 'react-markdown';
import Prism from 'prismjs';
import toast from 'react-hot-toast';

import { FiDownload, FiCopy } from "react-icons/fi";

const Message = ({ message }) => {

  useEffect(() => {
    Prism.highlightAll();
    console.log(message);
  }, [message?.content]);

  // Copy Text Function
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Message copied to clipboard!");
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  // Download Image Function
  const handleDownload = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "TanishGPT_Generated_Image.png";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (

    <div>
      {message?.role === "user" ? (
        <div className='flex items-center justify-end my-4 gap-2'>
          
          <div className='flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md max-w-2xl'>
            
            <p className='text-sm dark:text-primary'>
              {message?.content}
            </p>

            <div className='flex items-center justify-between gap-4'>
              
              <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>
                {moment(message?.timestamp).fromNow()}
              </span>

              {/* Copy Button */}
              <button
                onClick={() => handleCopy(message?.content)}
                className='flex items-center gap-1 text-xs text-gray-500 hover:text-purple-500 transition'
              >
                <FiCopy size={14} />
                Copy
              </button>

            </div>

          </div>

          <img
            src={assets.user_icon}
            alt="User Icon"
            className="w-8 rounded-full"
          />
        </div>
      ) : (
        <div className='inline-flex flex-col gap-2 p-2 px-2 max-w-2xl bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md my-4'>
          
          {/* Image Message */}
          {message?.isImage ? (
            <>
              <img
                src={message?.content}
                alt="Generated Image"
                className="w-full rounded-md max-w-md mt-2"
              />

              <div className='flex items-center justify-between px-1 mt-1'>
                
                <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>
                  {moment(message?.timestamp).fromNow()}
                </span>

                {/* Download Button */}
                <button
                  onClick={() => handleDownload(message?.content)}
                  className='flex items-center gap-1 text-xs text-gray-500 hover:text-purple-500 transition'
                >
                  <FiDownload size={14} />
                  Download
                </button>

              </div>
            </>
          ) : (
            <>
              {/* Text Message */}
              <div className='text-sm dark:text-primary reset-tw'>
                <Markdown>{message?.content}</Markdown>
              </div>

              <div className='flex items-center justify-between px-1 mt-1'>
                
                <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>
                  {moment(message?.timestamp).fromNow()}
                </span>

                {/* Copy Button */}
                <button
                  onClick={() => handleCopy(message?.content)}
                  className='flex items-center gap-1 text-xs text-gray-500 hover:text-purple-500 transition'
                >
                  <FiCopy size={14} />
                  Copy
                </button>

              </div>
            </>
          )}

        </div>
      )}
    </div>

  )
}

export default Message;