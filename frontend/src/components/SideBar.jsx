import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import dp from "../assets/dp.webp";
import { IoSearchOutline } from "react-icons/io5";
import { GiCrossMark } from "react-icons/gi";
import { CiLogout } from "react-icons/ci";

import { serverUrl } from "../main";
import {
  setUserData,
  setOtherUsers,
  setSelectedUser,
  setOnlineUsers,
} from "../redux/userSlice";

const SideBar = () => {
  const { userData, otherUsers, selectedUser, socket, onlineUsers } =
    useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });

      localStorage.removeItem("user");

      socket?.disconnect();
      dispatch(setOnlineUsers([]));
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (input.trim() === "") {
      setSearchResults([]);
      return;
    }

    setSearching(true);

    const timer = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/api/user/search?query=${input}`,
          { withCredentials: true }
        );
        setSearchResults(data);
      } catch (error) {
        console.log(error);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [input]);

  const listToShow = input.trim() !== "" ? searchResults : otherUsers;

  return (
    <div
      className={`lg:w-[30%] w-full lg:block h-screen bg-slate-200 ${
        !selectedUser ? "block" : "hidden"
      }`}
    >
      <div className="w-full h-[220px]  from bg-black shadow-gray-400 shadow-lg p-4 ">
        <h1 className="text-white font-bold text-[30px] mt-8 items-center">RealChat</h1>

        <div className="flex justify-between items-center mt-4">
          <h1 className="text-black text-[18px] font-semibold text-white ">
            Hii, {userData?.name || userData?.userName}
          </h1>

          <div className="relative w-[45px] h-[45px]">
            <img
              src={userData?.image || dp}
              alt="profile"
              className="w-full h-full rounded-full object-cover cursor-pointer shadow-gray-500 shadow-lg"
              onClick={() => navigate("/profile")}
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </div>
        </div>

        <form className="w-full h-[55px] mt-5 bg-white rounded-full flex items-center px-4 shadow-lg">
          <IoSearchOutline className="text-gray-500 text-[22px]" />

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search users..."
            className="flex-1 ml-3 outline-none bg-transparent text-gray-700"
          />

          {input.trim() !== "" && (
            <GiCrossMark
              className="text-gray-600 text-[18px] cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setInput("");
                setSearchResults([]);
              }}
            />
          )}
        </form>
      </div>

      <div className="h-[calc(100vh-220px)] overflow-y-auto p-3 ">
        {searching ? (
          <div className="text-center text-gray-500 mt-10">Searching...</div>
        ) : listToShow?.length > 0 ? (
          listToShow.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 bg-amber-50 p-3 rounded-xl mb-3 shadow-md cursor-pointer transition"
              onClick={() => dispatch(setSelectedUser(user))}
            >
              <div className="relative w-[50px] h-[50px] shrink-0">
                <img
                  src={user?.image || dp}
                  alt={user?.userName}
                  className="w-full h-full rounded-full object-cover"
                />

                {onlineUsers?.includes(user._id?.toString()) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>

              <div>
                <h1 className="font-semibold text-red-800">
                  {user?.name || user?.userName}
                </h1>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-10">
            No users found
          </div>
        )}
      </div>

      <div
        onClick={handleLogout}
        className="fixed bottom-5 left-5 w-[55px] h-[55px] rounded-full bg-blue-900 flex justify-center items-center shadow-lg cursor-pointer hover:scale-110 transition z-50"
      >
        <CiLogout className="text-[28px] text-white" />
      </div>
    </div>
  );
};

export default SideBar;
