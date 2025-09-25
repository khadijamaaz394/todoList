import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import useAuth from "./hooks/useAuth.js";
import "./App.css";

function RequireAuth({ children }) {
  const { user, isAuthLoading } = useAuth() || {};
  if (isAuthLoading) return <div>Checking session…</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function PublicOnly({ children }) {
  const { user, isAuthLoading } = useAuth() || {};
  if (isAuthLoading) return <div />; 
  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Protected */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />

        {/* Public only */}
        <Route
          path="/login"
          element={
            <PublicOnly>
              <Login />
            </PublicOnly>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnly>
              <Signup />
            </PublicOnly>
          }
        />

        {/* london bridge is falling back */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
