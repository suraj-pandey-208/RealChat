import React, { useEffect, useRef, useState } from "react";
import dp from "../assets/dp.webp";
import { FaCamera } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { serverUrl } from "../main";
import { setUserData } from "../redux/userSlice";

const Profile = () => {
  const { userData } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [frontendImage, setFrontendImage] = useState(dp);
  const [backendImage, setBackendImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const image = useRef();

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setFrontendImage(userData.image || dp);
    }
  }, [userData]);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("name", name);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      const { data } = await axios.put(
        `${serverUrl}/api/user/profile`,
        formData,
        {
          withCredentials: true,
        }
      );

      console.log("Updated User:", data);

      dispatch(setUserData(data));
      localStorage.setItem("user", JSON.stringify(data));

      alert("Profile Updated Successfully");

      navigate("/");
    } catch (error) {
      console.log(error);
      alert(
        error?.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0d0510] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[320px] h-[320px] bg-pink-600/20 rounded-full blur-[110px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[320px] h-[320px] bg-fuchsia-700/20 rounded-full blur-[110px]" />

      <div className="fixed top-[20px] left-[20px] z-20">
        <div className="w-11 h-11 flex items-center justify-center rounded-full bg-[#1a0f1c]/80 border border-pink-500/20 backdrop-blur-md hover:border-pink-400/50 transition-colors">
          <IoMdArrowBack
            className="w-6 h-6 cursor-pointer text-pink-300"
            onClick={() => navigate("/")}
          />
        </div>
      </div>

      <div
        className="relative w-[190px] h-[190px] rounded-full border-4 border-pink-500/70 shadow-lg shadow-pink-900/50 mb-8 cursor-pointer group z-10"
        onClick={() => image.current.click()}
      >
        <div className="w-full h-full overflow-hidden rounded-full">
          <img
            src={frontendImage}
            alt="Profile"
            className="w-full h-full object-cover group-hover:brightness-75 transition-all"
          />
        </div>

        <div className="absolute bottom-2 right-0 translate-x-1/4 bg-gradient-to-br from-pink-500 to-fuchsia-600 p-3 rounded-full shadow-lg shadow-pink-900/50">
          <FaCamera size={16} className="text-white" />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[440px] flex flex-col gap-4 bg-[#16091a]/70 backdrop-blur-xl border border-pink-500/10 rounded-2xl p-6 shadow-2xl shadow-black/60 z-10"
      >
        <input
          type="file"
          accept="image/*"
          ref={image}
          hidden
          onChange={handleImage}
        />

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-[48px] bg-[#1e0f22] border border-pink-500/20 focus:border-pink-400/70 rounded-xl px-5 outline-none text-slate-200 placeholder:text-slate-500 transition-colors"
        />

        <input
          type="text"
          value={userData?.userName || ""}
          readOnly
          className="h-[48px] bg-[#1e0f22]/60 border border-white/5 rounded-xl px-5 outline-none text-slate-500"
        />

        <input
          type="email"
          value={userData?.email || ""}
          readOnly
          className="h-[48px] bg-[#1e0f22]/60 border border-white/5 rounded-xl px-5 outline-none text-slate-500"
        />

        <button
          type="submit"
          disabled={saving}
          className="mt-2 h-[46px] w-fit px-8 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white font-semibold rounded-xl shadow-lg shadow-pink-900/40 hover:shadow-pink-600/40 hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;