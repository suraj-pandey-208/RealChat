import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { serverUrl } from "../main";
import { setUserData } from "../redux/userSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      navigate("/");
    }
  }, [userData, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("All fields are required");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      const res = await axios.post(
        `${serverUrl}/api/auth/login`,
        { email: email.trim(), password },
        { withCredentials: true }
      );

      dispatch(setUserData(res.data));
      toast.success("Login Successful");
      navigate("/");

    } catch (error) {
      toast.error(error?.response?.data?.msg || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0a0e17] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px]  blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px]  blur-[100px]" />

      <div className="w-full max-w-[440px] bg-[#111826]/90 backdrop-blur-xl border border-white/10  shadow-2xl shadow-black/50 flex flex-col gap-8 pb-8 relative z-10">

        <div className="w-full h-[180px] bg-gradient-to-br from-cyan-500 to-sky-700 flex items-center justify-center shadow-lg shadow-cyan-900/40">
          <h1 className="text-white/90 font-bold text-2xl tracking-wide">
            Welcome to <span className="text-white font-extrabold">ChatKaro</span>
          </h1>
        </div>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-5 items-center px-2">

          <input
            type="email"
            placeholder="Email"
            className="w-[90%] h-[56px] bg-[#1a2333] border border-white/10 focus:border-cyan-400/60 rounded-xl px-5 outline-none text-slate-200 placeholder:text-slate-500 transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative w-[90%]">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full h-[56px] bg-[#1a2333] border border-white/10 focus:border-cyan-400/60 rounded-xl px-5 pr-12 outline-none text-slate-200 placeholder:text-slate-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-lg text-slate-400 hover:text-cyan-400 transition-colors"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 bg-gradient-to-r from-cyan-400 to-sky-500 rounded-xl text-lg w-[200px] font-semibold text-[#0a0e17] shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-slate-400">
            Don't Have An Account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-cyan-400 font-bold cursor-pointer hover:text-cyan-300 transition-colors"
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;