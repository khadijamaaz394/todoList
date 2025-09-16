import React from "react"
import { useAuth } from "./context/AuthContext"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Home from "./Home"
import './App.css'
function App() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div>
        <h2 className="signMsg">Please log in or sign up</h2>
        <Signup />
        <Login />
      </div>
    )
  }

  return <Home />
}

export default App
