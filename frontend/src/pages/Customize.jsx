import React, { useContext, useRef } from 'react'
import Card from '../components/Card'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/authBg.png"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.jpeg"
import image7 from "../assets/image7.jpeg"
import { RiImageAddFill } from "react-icons/ri";
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { IoMdArrowBack } from 'react-icons/io'

const Customize = () => {
    const {serverUrl,userData,setUserData,
        frontendImage, setFrontendImage,
        backendImage, setBackendImage,
        selectedImage, setSelectedImage}= useContext(userDataContext)
        
    const inputImage = useRef()
    const navigate=useNavigate()

    const handleImage=(e)=>{
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }
    return (
        <div className='w-full h-screen bg-linear-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-5'>

            <IoMdArrowBack onClick={()=>navigate("/")}  className='absolute top-7.5 left-7.5 text-white w-6.25 h-6.25 '/>

            <h1 className='text-white mb-6 text-[26px] text-center'>
                Select Your <span className='text-blue-200'>Assistant Image</span>
            </h1>

            {/* Cards */}
            <div className='w-[90%] max-w-4xl flex justify-center items-center flex-wrap gap-2'>
                <Card image={image1} />
                <Card image={image2} />
                <Card image={image3} />
                <Card image={image4} />
                <Card image={image5} />
                <Card image={image6} />
                <Card image={image7} />

                <div onClick={()=>{
                    inputImage.current.click()
                    setSelectedImage("input")
                }} 
                className={`w-14 h-28 sm:w-16 sm:h-32 lg:w-20 lg:h-40 bg-[#020220] border border-[#0000ff66] rounded-xl overflow-hidden hover:shadow-lg hover:shadow-blue-900 cursor-pointer hover:border-2 hover:border-white transition-all duration-300 flex items-center justify-center ${selectedImage == "input"?"border-2 border-white shadow-xl shadow-white/30 scale-105":null}`}>
                    {!frontendImage && 
                    <RiImageAddFill className='text-white w-5 h-5' />
                    }
                    {frontendImage && <img src={frontendImage} className='h-full object-cover'/>}
                    
                </div>
                <input onChange={handleImage} type="file" accept='image/*' ref={inputImage} hidden/>
            </div>

            {/* Button (NOW BELOW) */}
            {selectedImage && <button onClick={()=>navigate("/customize2")} className="mt-6 px-8 py-2 text-black font-semibold 
                bg-white rounded-full text-sm hover:bg-gray-200 transition cursor-pointer">
                Next
            </button>}
            

        </div>
    )
}

export default Customize