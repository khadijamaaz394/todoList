import { useState } from "react"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const { login } = useAuth()
  const [emailOrUsername, setEmailOrUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login({ emailOrUsername, password })
    } catch (err) {
      alert(err.response?.data?.error || "Login failed")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="signup">
      <input placeholder="Email or Username" value={emailOrUsername} onChange={e => setEmailOrUsername(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  )
}
