import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'

export const userDataContext = createContext()

const UserContext = ({ children }) => {

    const serverUrl = "https://virtualassistant-backend-raw2.onrender.com"

    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)

    const [frontendImage, setFrontendImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)

    // ✅ GET CURRENT USER
    const handleCurrentUser = async () => {
        try {
            const result = await axios.get(
                `${serverUrl}/api/user/current`,
                { withCredentials: true }
            )
            console.log("CURRENT USER:", result.data)

            setUserData(result.data)

        } catch (error) {
            console.log(error.response?.data)
            setUserData(null)
        } finally {
            setLoading(false)
        }
    }

    // ✅ ASSISTANT RESPONSE
    const getAssistantResponse = async (command) => {
        try {
            const token = localStorage.getItem("token")

            const result = await axios.post(
                `${serverUrl}/api/user/askToAssistant`,
                { command },
                { withCredentials: true }   // 👈 IMPORTANT FIX
            )

            return result.data

        } catch (error) {
            console.log("Assistant Error:", error.response?.data || error.message)

            return {
                response: "Server error"
            }
        }
    }

    useEffect(() => {
        handleCurrentUser()
    }, [])

    const value = {
        serverUrl,
        userData,
        setUserData,
        loading,

        frontendImage,
        setFrontendImage,
        backendImage,
        setBackendImage,
        selectedImage,
        setSelectedImage,

        getAssistantResponse
    }

    return (
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    )
}

export default UserContext
