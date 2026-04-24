import React, { useState, useContext } from 'react'
import bg from "../assets/authBg.png"
import { IoEye, IoEyeOff } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { userDataContext } from '../context/UserContext.jsx'

const SignIn = () => {

    const [showPassword, setShowPassword] = useState(false)
    const { serverUrl, userData, setUserData } = useContext(userDataContext)
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    

    const handleSignIn = async (e) => {
        e.preventDefault()
        // console.log(serverUrl)
        setLoading(true)

        if (password.length < 8) {
            toast.error("Password must be at least 4 characters")
            return
        }

        try {

            let result = await axios.post(
                `${serverUrl}/api/auth/signin`,
                { email, password }
            )
            toast.success("Signin successful 🎉")
            // ✅ inputs clear
            // setName("")
            setEmail("")
            setPassword("")
            // navigate("/signin")
            setUserData(result.data)
            window.location.href = "/"

            setLoading(false)
            navigate("/")

            
        } catch (error) {
            if (error.response?.data?.message === "Email already exists !") {
                toast.error("This email is already exist")
            }
            else {
                toast.error(error.response?.data?.message || "Something went wrong")
            }
            setLoading(false)
            setUserData(null)
        }
    }

    return (
        <div
            className="w-full min-h-screen bg-cover bg-center flex justify-center items-center px-4"
            style={{ backgroundImage: `url(${bg})` }}
        >

            <form
                autoComplete="off"
                onSubmit={handleSignIn}
                className="w-full max-w-md bg-[#00000070] backdrop-blur-md shadow-lg shadow-black 
                flex flex-col items-center justify-center gap-4 px-6 py-8 rounded-xl"
            >

                <h1 className="text-white text-xl sm:text-2xl font-semibold text-center mb-2">
                    Sign In to <span className="text-blue-500">Virtual Assistant</span>
                </h1>

                {/* Email */}
                <input
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email"
                    className="w-full h-12 sm:h-14 border border-white bg-transparent text-white 
                    placeholder-gray-300 px-4 rounded-full text-sm sm:text-base outline-none"
                    required
                />

                {/* Password */}
                <div className="w-full h-12 sm:h-14 border border-white rounded-full relative">
                    <input
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="w-full h-full bg-transparent text-white placeholder-gray-300 
                        px-4 rounded-full outline-none text-sm sm:text-base"
                        required
                    />

                    {!showPassword ? (
                        <IoEye
                            onClick={() => setShowPassword(true)}
                            className="absolute top-1/2 right-4 -translate-y-1/2 text-white cursor-pointer text-xl"
                        />
                    ) : (
                        <IoEyeOff
                            onClick={() => setShowPassword(false)}
                            className="absolute top-1/2 right-4 -translate-y-1/2 text-white cursor-pointer text-xl"
                        />
                    )}
                </div>


                {/* Button */}
                <button
                    className="w-full h-12 sm:h-14 mt-2 text-black font-semibold 
                    bg-white rounded-full text-sm sm:text-base hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"  disabled={loading}
                >
                    {loading ? "Loading..." : "Sign In"}
                </button>

                {/* Redirect */}
                <p
                    onClick={() => navigate("/signup")}
                    className="text-white text-sm sm:text-base text-center cursor-pointer"
                >
                    Want to create a new account ?
                    <span className="text-blue-400 ml-1">Sign Up</span>
                </p>
                

            </form>
        </div>
    )
}

export default SignIn