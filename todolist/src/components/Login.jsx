import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login({ emailOrUsername, password });
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    
    <form onSubmit={handleSubmit} className="signup login-form">
      
      <div className="login-controls">
        <input
          placeholder="Email or Username"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Logging in…" : "Login"}
        </button>
      </div>

      
      <div className="auth-switch">
        <span>Don’t have an account?</span>
        <button
          type="button"
          className="link-btn"
          onClick={() => navigate("/signup")}
        >
          Sign up
        </button>
      </div>
    </form>
  );
}
