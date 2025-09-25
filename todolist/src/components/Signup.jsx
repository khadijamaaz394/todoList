import { useState } from "react";
import useAuth from "../hooks/useAuth.js";
import axiosInstance from "../utils/axiosInstance";

export default function Signup() {
  const { signup, setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const payload = { username, name: username, email, password };

    try {
      const res = await signup(payload);

      const token = res?.token ?? res?.data?.token;
      const user  = res?.user  ?? res?.data?.user;

      if (token) {
        localStorage.setItem("token", token); 
      }

      if (user) {
        setUser(user); 
      } else if (token) {
        
        const me = await axiosInstance.get("/api/auth/me");
        setUser(me.data);
      }
    } catch (err) {
      console.error(err?.response?.data || err);
      alert(err?.response?.data?.error || "Sign up failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup">
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={submitting}>
        {submitting ? "Creating account…" : "Signup"}
      </button>
    </form>
  );
}
