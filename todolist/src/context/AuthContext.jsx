import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"

const AuthContext = createContext()

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("auth")
    return raw ? JSON.parse(raw).user : null
  })
  const [token, setToken] = useState(() => {
    const raw = localStorage.getItem("auth")
    return raw ? JSON.parse(raw).token : null
  })

  useEffect(() => {
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    else delete axios.defaults.headers.common["Authorization"]
  }, [token])

  useEffect(() => {
    if (user && token) localStorage.setItem("auth", JSON.stringify({ user, token }))
    else localStorage.removeItem("auth")
  }, [user, token])

  const signup = async (data) => {
    const res = await axios.post("http://localhost:3001/api/auth/signup", data)
    setToken(res.data.token)
    setUser(res.data.user)
  }

  const login = async (data) => {
    const res = await axios.post("http://localhost:3001/api/auth/login", data)
    setToken(res.data.token)
    setUser(res.data.user)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("auth")
    delete axios.defaults.headers.common["Authorization"]
  }

  return (
    <AuthContext.Provider value={{ user, token, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
