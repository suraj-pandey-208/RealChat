import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from "react-icons/fa"
import axios from "axios"
import { toast } from "react-toastify"
import { serverUrl } from '../main'
import { setUserData } from '../redux/userSlice'

function Signup() {

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const { userData } = useSelector((state) => state.user)

  console.log(userData)

  const [showPassword, setShowPassword] = useState(false)

  const [userName, setUserName] = useState("")

  const [email, setEmail] = useState("")

  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {

    e.preventDefault()


   
    if (!userName || !email || !password) {
      toast.error("All fields are required ")
      return
    }

    if (password.length<6) {
      toast.error("Password must be at least 6 characters ")
      return
    }

    
    if(loading) return

    
    setLoading(true)

    try {

      const result = await axios.post(

        `${serverUrl}/api/auth/signup`,

        {
          userName,
          email,
          password
        },
        {
          withCredentials: true
        }
      )


      dispatch(setUserData(result.data))
      toast.success("Signup successful ")

      navigate("/profile")

    } catch (error) {

      toast.error(
        error.response?.data?.msg ||"Signup failed "
      )

    } finally {
      setLoading(false)
    }
  }

  return (

  <div className="w-full h-[100vh] bg-slate-300 flex items-center justify-center">
<div className="w-full max-w-[500px] h-[600px]  bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[30px]">
<div className="w-full h-[200px] bg-blue-600 flex items-center justify-center">
 <h1 className="text-blue-500 font-bold-600px text-[19px]">
Welcome to <span className="text-white">ChatKaro</span>
          </h1>
        </div>
        <form
          className="w-full flex flex-col gap-[20px] items-center"
          onSubmit={handleSignup}
        >
          <input
            type="text"
            placeholder="Username"
            className="w-[90%] h-[60px] border-2 border-[#20c7ff] rounded-lg px-[20px]"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-[90%] h-[60px] border-2 border-[#20c7ff] rounded-lg px-[20px]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative w-[90%]">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full h-[60px] border-2 border-[#20c7ff] rounded-lg px-[20px]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-xl"
            >
{
                showPassword
                  ? <FaEye />
                  : <FaEyeSlash />
              }

            </span>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-[20px] py-[10px] bg-[#20c7ff] rounded-2xl text-[18px] w-[200px] font-semibold"
          >

            {
              loading
                ? "Signing Up..."
                : "Sign Up"
            }

          </button>
          <p onClick={() => navigate("/login")}>
            Already Have An Account?{" "}
            <span className="text-[#20c7ff] font-bold cursor-pointer">
              Login
            </span>
          </p>
        </form>

      </div>

    </div>
  )
}

export default Signup