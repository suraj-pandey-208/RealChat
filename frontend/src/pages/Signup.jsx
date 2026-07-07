import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { serverUrl } from "../main";
import { setUserData } from "../redux/userSlice";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);
  console.log(userData);
  const [showPassword, setShowPassword] = useState(false);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!userName || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          userName,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(setUserData(result.data));

      toast.success("Signup Successful");

      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0f172a] flex items-center justify-center px-5">
      <div className="w-full max-w-[550px] bg-[#1e293b] rounded-xl overflow-hidden shadow-2xl">


        <div className="w-full h-[180px] bg-cyan-600 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">
            Welcome to <span>RealChat</span>
          </h1>
        </div>


        <form
          onSubmit={handleSignup}
          className="flex flex-col items-center gap-6 py-10"
        >
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-[90%] h-[60px] bg-[#0f172a] border border-gray-600 rounded-lg px-5 text-white placeholder-gray-400 outline-none focus:border-cyan-400"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[90%] h-[60px] bg-[#0f172a] border border-gray-600 rounded-lg px-5 text-white placeholder-gray-400 outline-none focus:border-cyan-400"
          />

          <div className="relative w-[90%]">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[60px] bg-[#0f172a] border border-gray-600 rounded-lg px-5 text-white placeholder-gray-400 outline-none focus:border-cyan-400"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-400"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-[220px] h-[55px] rounded-xl bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 text-black font-bold text-lg"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          <p className="text-gray-300">
            Already Have An Account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-cyan-400 font-semibold cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
