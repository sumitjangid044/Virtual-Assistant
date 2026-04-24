import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const Customize2 = () => {

    const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(userDataContext)
    const navigate=useNavigate()
    const [assistantName, setAssistantName] = useState(userData?.assistantName || "")
    const [loading, setLoading] = useState(false)

    const handleUpdateAssistant = async () => {
        setLoading(true)
        try {
            let formData = new FormData()

            formData.append("assistantName", assistantName)

            if (backendImage) {
                formData.append("assistantImage", backendImage)
            } else {
                formData.append("imageUrl", selectedImage)
            }

            const result = await axios.post(
                `${serverUrl}/api/user/update`,
                formData,
                { withCredentials: true }
            )
            setLoading(false)
            console.log(result.data)
            setUserData(result.data)
            navigate("/")

        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    return (
        <div className='w-full h-screen bg-linear-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-5 relative'>
            <IoMdArrowBack onClick={()=>navigate("/customize")}  className='absolute top-7.5 left-7.5 text-white w-6.25 h-6.25 '/>
            <h1 className='text-white mb-6 text-[26px] text-center'>
                Enter Your <span className='text-blue-200'>Assistant Name</span>
            </h1>

            <input
                onChange={(e) => setAssistantName(e.target.value)}
                value={assistantName}
                type="text"
                placeholder="Eg. Siri"
                className='w-full max-w-150 h-15 outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 rounded-full text-[18px]'
            />

            {assistantName && !loading && (
                <button
                    onClick={handleUpdateAssistant}
                    className="mt-6 px-8 py-2 text-black font-semibold bg-white rounded-full text-sm hover:bg-gray-200 transition cursor-pointer"
                >
                    Finally Create Your Assistant
                </button>
            )}

        </div>
    )
}

export default Customize2