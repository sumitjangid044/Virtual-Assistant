import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Customize from './pages/Customize.jsx'
import Customize2 from './pages/Customize2.jsx'
import Home from './pages/Home'
import { userDataContext } from './context/UserContext'

const App = () => {

  const { userData, loading } = useContext(userDataContext)
  // console.log(userData)
  const isLoggedIn = !!userData?.email   // ✅ FIX

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-black">
        Loading...
      </div>
    )
  }

  return (
    <Routes>

      {/* Home */}
      <Route
        path="/"
        element={
          (userData?.assistantImage && userData?.assistantName)
            ? <Home />
            : <Navigate to={"/customize"}/>
        }
      />

      {/* Auth */}
      <Route
        path="/signup"
        element={!userData? <SignUp /> : <Navigate to={"/"} />}
      />

      <Route
        path="/signin"
        element={!userData? <SignIn /> : <Navigate to={"/"} />}
      />

      {/* Customize */}
      <Route
        path="/customize"
        element={userData ? <Customize /> : <Navigate to={"/signup"} />}
      />

      <Route
        path="/customize2"
        element={userData ? <Customize2 /> : <Navigate to={"/signup"} />}
      />

    </Routes>
  )
}

export default App