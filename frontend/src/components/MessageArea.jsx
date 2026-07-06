import React, { useEffect, useRef, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.webp";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { addMessage, setMessages } from "../redux/messageSlice";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { FaImages } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import axios from "axios";
import { serverUrl } from "../main";
import useGetMessages from "../customHook/useGetMessages";

const MessageArea = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedUser, userData, socket } = useSelector(
    (state) => state.user
  );

  const { messages } = useSelector(
    (state) => state.message
  );

  useGetMessages();

  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);

  const pickerRef = useRef(null);
  const imageRef = useRef(null);
  const messagesEndRef = useRef(null);

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!selectedUser) return;

    if (!message.trim() && !backendImage) return;

    try {
      const formData = new FormData();

      formData.append("message", message);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      const { data } = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        {
          withCredentials: true,
        }
      );

      dispatch(addMessage(data));

      setMessage("");
      setFrontendImage(null);
      setBackendImage(null);
      setShowPicker(false);

      if (imageRef.current) {
        imageRef.current.value = "";
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Click outside handler for emoji picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // Socket listener for incoming real-time messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (mess) => {
      dispatch(addMessage(mess));
    };

    socket.on("newMessage", handleNewMessage);

    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, dispatch]);

  return (
    <div
      className={`lg:w-[70%] w-full h-full bg-black border-l border-white/10 ${
        selectedUser ? "flex" : "hidden lg:flex"
      } flex-col relative`}
    >
      {!selectedUser ? (
        <div className="w-full h-full flex flex-col items-center justify-center px-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-pink-500/20 mb-6">
            <IoSend className="w-9 h-9 text-white -rotate-45" />
          </div>

          <h1 className="text-[42px] sm:text-[50px] font-bold text-white text-center">
            Welcome to RealChat
          </h1>

          <p className="text-lg sm:text-[22px] text-pink-300/70 mt-2 font-medium">
          </p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="w-full h-[80px] bg-black border-b border-white/10 flex items-center gap-4 px-5 z-10">
            <IoMdArrowBack
              className="w-7 h-7 cursor-pointer text-white/70 hover:text-pink-400 hover:scale-110 active:scale-95 transition-all"
              onClick={() => {
                dispatch(setSelectedUser(null));
                navigate("/");
              }}
            />

            <div className="w-[46px] h-[46px] rounded-full overflow-hidden ring-2 ring-pink-500/40 shadow-sm">
              <img
                src={selectedUser?.image || dp}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-white text-lg font-semibold tracking-wide truncate">
              {selectedUser?.name}
            </h1>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3 scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
            {messages.map((msg) =>
              msg.sender === userData?._id ? (
                <SenderMessage
                  key={msg._id}
                  message={msg.message}
                  image={msg.image}
                />
              ) : (
                <ReceiverMessage
                  key={msg._id}
                  message={msg.message}
                  image={msg.image}
                />
              )
            )}

            <div ref={messagesEndRef}></div>
          </div>

          {/* Emoji Picker */}
          {showPicker && (
            <div
              ref={pickerRef}
              className="absolute bottom-[85px] left-4 z-50 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width={300}
                height={350}
                theme="dark"
              />
            </div>
          )}

          {/* Image Preview */}
          {frontendImage && (
            <div className="px-5 pb-3">
              <div className="relative w-fit ml-auto">
                <img
                  src={frontendImage}
                  alt="preview"
                  className="w-[110px] h-[110px] object-cover rounded-2xl shadow-md ring-1 ring-white/10"
                />

                <button
                  type="button"
                  onClick={() => {
                    setFrontendImage(null);
                    setBackendImage(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full shadow-md flex items-center justify-center text-sm font-bold transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="w-full p-4 border-t border-white/10">
            <form
              onSubmit={handleSendMessage}
              className="w-full min-h-[58px] bg-white/5 border border-white/10 rounded-full flex items-center px-5 gap-4 focus-within:ring-1 focus-within:ring-pink-500/50 transition-all"
            >
              <MdOutlineEmojiEmotions
                onClick={() =>
                  setShowPicker((prev) => !prev)
                }
                className="w-6 h-6 text-pink-400 cursor-pointer hover:scale-110 active:scale-95 transition-transform shrink-0"
              />

              <input
                type="file"
                hidden
                accept="image/*"
                ref={imageRef}
                onChange={handleImage}
              />

              <input
                type="text"
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                placeholder="Type a message..."
                className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40 text-[15px]"
              />

              <FaImages
                onClick={() =>
                  imageRef.current.click()
                }
                className="w-5 h-5 text-pink-400 cursor-pointer hover:scale-110 active:scale-95 transition-transform shrink-0"
              />

              {(message.trim().length > 0 || backendImage) && (
                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center shadow-md shadow-pink-500/30 hover:shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0"
                >
                  <IoSend className="w-4 h-4 text-white" />
                </button>
              )}
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageArea;