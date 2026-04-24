import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

const Card = ({ image }) => {
    const {serverUrl,userData,setUserData,
            frontendImage, setFrontendImage,
            backendImage, setBackendImage,
            selectedImage, setSelectedImage}= useContext(userDataContext)
    return (
        <div onClick={()=>{
            setSelectedImage(image)
            setBackendImage(null)
            setFrontendImage(null)
        }} 
            className={`w-14 h-28 sm:w-16 sm:h-32 lg:w-20 lg:h-40 bg-[#020220] border border-[#0000ff66] rounded-xl overflow-hidden hover:shadow-lg hover:shadow-blue-900 cursor-pointer hover:border-2 hover:border-white transition-all duration-300 ${selectedImage == image?"border-2 border-white shadow-xl shadow-white/30 scale-105":null}`}>
            <img 
                src={image} 
                alt="card" 
                className="w-full h-full object-cover rounded-xl" 
            />
        </div>
    )
}

export default Card