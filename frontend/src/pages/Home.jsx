import React, { useContext, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'
import aiImg from "../assets/ai.gif"
import userImg from "../assets/user.gif"
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
const Home = () => {
    const { userData, serverUrl, setUserData, getAssistantResponse } = useContext(userDataContext)
    const navigate = useNavigate()
    const hasLoggedRef = useRef(false);
    const [listening, setListening] = useState(false)
    const [userText, setUserText] = useState("")
    const [aiText, setAiText] = useState("")
    const isSpeakingRef = useRef(false)
    const recognitionRef = useRef(null)
    const [ham, setHam]= useState(false)
    const isRecognizingRef = useRef(false);
    const synth = window.speechSynthesis

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
            setUserData(null)
            navigate("/signin")
        } catch (error) {
            setUserData(null)
            console.log(error)
        }
    }

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN';

        const voices = window.speechSynthesis.getVoices();  // ✅ pehle define

        // 👉 Hindi voice find
        const hindiVoice = voices.find(v => v.lang === 'hi-IN');

        if (hindiVoice) {
            utterance.voice = hindiVoice;
        } else if (voices.length > 0) {
            utterance.voice = voices[0]; // fallback
        }

        speechSynthesis.cancel();
        isSpeakingRef.current = true;

        utterance.onend = () => {
            setAiText("")
            isSpeakingRef.current = false;


            if (recognitionRef.current && !isRecognizingRef.current) {
                try {
                    recognitionRef.current.start();
                    console.log("restart after speaking");
                } catch (error) {
                    if (error.name !== "InvalidStateError") {
                        console.log("Start Error:", error);
                    }
                }
            }
        };

        speechSynthesis.speak(utterance);
    };

    const handleCommand = (data) => {

        if (!data) return;

        const { type, userInput, response } = data;

        // 🔊 speak once
        if (response) {
            speak(response);
        }

        // ✅ FIRST DEFINE cleanQuery (IMPORTANT 🔥)
        let cleanQuery = (userInput || "").toLowerCase();

        cleanQuery = cleanQuery
            .replace(userData.assistantName.toLowerCase(), "")
            .replace("search", "")
            .replace("on youtube", "")
            .replace("youtube", "")
            .replace("play", "")
            .replace("on google", "")
            .replace("google", "")
            .trim();

        const query = encodeURIComponent(cleanQuery);

        // 👉 Google
        if (type === "google_search") {
            window.open(`https://www.google.com/search?q=${query}`, "_blank");
        }

        // 👉 YouTube
        else if (type === "youtube_search" || type === "youtube_play") {
            window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
        }

        // 👉 Calculator
        else if (type === "calculator_open") {
            window.open(`https://www.google.com/search?q=calculator`, "_blank");
        }

        // 👉 Instagram
        else if (type === "instagram_open") {
            window.open(`https://www.google.com/search?q=${query}+site:instagram.com`, "_blank");
        }

        // 👉 Facebook
        else if (type === "facebook_open") {
            window.open(`https://www.facebook.com`, "_blank");
        }

        // 👉 Weather
        else if (type === "weather_show") {
            window.open(`https://www.google.com/search?q=weather+${query}`, "_blank");
        }
    }

    useEffect(() => {
        if (!userData) return;

        console.log("USER DATA:", userData)
        hasLoggedRef.current = true;

        const isProcessingRef = { current: false };

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'en-us';

        recognition.interimResults = false;

        recognitionRef.current = recognition;

        const isRecognizingRef = { current: false };

        const safeRecognition = () => {
            if (!isSpeakingRef.current && !isRecognizingRef.current) {
                try {
                    recognition.start();
                    console.log("recognition requested to start");
                } catch (error) {
                    if (error.name !== "InvalidStateError") {
                        console.log("Start Error:", error);
                    }
                }
            }
        }

        let isMounted = true;

        const startTimeout = setTimeout(()=>{
            if (isMounted && !isRecognizingRef.current && !isSpeakingRef.current) {
                try{
                    recognition.start();
                    console.log("initial recognition start");
                } catch(error){
                    if (error.name !== "InvalidStateError") {
                        console.error(error);
                    }
                }
            }
        }, 1000);

        recognition.onstart = () => {
            // console.log("recognition started");
            isRecognizingRef.current = true;
            setListening(true)
        };

        recognition.onend = () => {
            // console.log("recognition ended");
            isRecognizingRef.current = false;
            setListening(false);

            if (isMounted && !isSpeakingRef.current) {
                setTimeout(()=>{
                    if(isMounted){
                        try {
                            recognition.start();
                            console.log("Recognition restarted");
                        } catch(error){
                            if(error.name !== "InvalidStateError") {
                                console.error(error);
                            }
                        }
                    }
                },1000)
            }

            if (!isSpeakingRef.current) {
                safeRecognition();
            }
        };

        recognition.onerror = (e) => {
            console.log("Recognition Error:", e.error);
            isRecognizingRef.current = false;
            setListening(false)
            if (e.error !== "aborted" && isMounted && !isSpeakingRef.current) {
                safeRecognition();
                setTimeout(()=>{
                    if(isMounted){
                        try {
                            recognition.start();
                            console.log("Recognition restarted after error");
                        } catch(error){
                            if(error.name !== "InvalidStateError") {
                                console.error(error);
                            }
                        }
                    }
                },1000)
            }
        };

        recognition.onresult = async (e) => {
            const transcript = e.results[e.results.length - 1][0].transcript.trim();
            // console.log("heard:", transcript);

            if (
                transcript.toLowerCase().includes(userData.assistantName.toLowerCase()) &&
                !isProcessingRef.current
            ) {
                setAiText("")
                setUserText(transcript);
                recognition.stop();
                isRecognizingRef.current = false;
                setListening(false);
                isProcessingRef.current = true;

                const data = await getAssistantResponse(transcript);

                if (!data || !data.response) {
                    speak("Error");
                    isProcessingRef.current = false;
                    return;
                }

                handleCommand(data);
                setAiText(data.response);
                setUserText("");

                setTimeout(() => {
                    isProcessingRef.current = false;
                }, 2000);
            }
        };

        const fallback = setInterval(() => {
            if (!isSpeakingRef.current && !isRecognizingRef.current) {
                safeRecognition();
            }
        }, 10000)
        // safeRecognition();


        return () => {
            isMounted = false;
            clearTimeout(startTimeout);
            recognition.stop();
            setListening(false);
            isRecognizingRef.current = false;
            clearInterval(fallback);
        }

        // recognition.start();

    }, [userData]);

    return (
        <div className='w-full h-screen bg-linear-to-t from-[black] to-[#02023d] flex flex-col items-center justify-center gap-4 relative overflow-hidden'>
            <CgMenuRight onClick={()=>setHam(true)} className='lg:hidden text-white absolute top-5 right-5 w-6.25 h-6.25' />
            <div className={`absolute top-0 w-full h-full lg:hidden bg-[#00000053] backdrop-blur-lg p-5 flex-col ${ham?"translate-x-0":"translate-x-full"} transition-transform `}>
                <RxCross1 onClick={()=>setHam(false)} className=' text-white absolute top-5 right-5 w-6.25 h-6.25' />

                    
                <div className="flex gap-3 mt-4">
                    <button
                    onClick={handleLogOut}
                    className='px-3 py-1.5 text-sm text-black font-medium bg-white rounded-full hover:bg-gray-200 transition cursor-pointer'
                >
                    Logout
                </button>

                <button
                    onClick={() => navigate("/customize")}
                    className='px-3 py-1.5 text-sm text-black font-medium bg-white rounded-full hover:bg-gray-200 transition cursor-pointer'
                >
                    Customize
                </button>
                </div>

                <div className='w-full h-0.5 bg-gray-400 mt-5'></div>
                <h1  className='text-white font-semiBold text-[19px]'>History</h1>

                <div className='w-full h-[60vh] overflow-y-auto flex flex-col gap-3 items-start pr-2'>
                    {userData.history?.map((his, index)=>(
                        <span key={index} className='text-gray-400 text-[18px] '>{his}</span>
                    ))}
                </div>

            </div>

            {/* ✅ Buttons in one line */}
            <div className='absolute top-5 right-5 flex gap-2'>

                <button
                    onClick={handleLogOut}
                    className='px-3 py-1.5 text-sm text-black font-medium bg-white rounded-full hover:bg-gray-200 transition cursor-pointer hidden lg:block'
                >
                    Logout
                </button>

                <button
                    onClick={() => navigate("/customize")}
                    className='px-3 py-1.5 text-sm text-black font-medium bg-white rounded-full hover:bg-gray-200 transition cursor-pointer hidden lg:block'
                >
                    Customize
                </button>

            </div>

            {/* ✅ Image with normal curve */}
            <div className='w-60 h-80 rounded-3xl overflow-hidden shadow-xl shadow-black/40'>
                <img
                    src={userData?.assistantImage}
                    alt="assistant"
                    className='w-full h-full  object-center'
                />
            </div>

            {/* ✅ Name */}
            <h1 className='text-white text-2xl mt-4 font-semibold'>
                I'm {userData?.assistantName}
            </h1>
            {!aiText && <img src={userImg} alt="User" className='w-50 ' />}
            {aiText && <img src={aiImg} alt="User" className='w-50 ' />}

            <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText ? userText : aiText ? aiText : null}</h1>

        </div>
    )
}

export default Home