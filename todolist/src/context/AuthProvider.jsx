import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import AuthContext from "./auth-context";
import { useQueryClient } from "@tanstack/react-query";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const qc = useQueryClient();

  // Auto-logout on 401 errors
  useEffect(() => {
    const id = axiosInstance.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err?.response?.status === 401) {
          localStorage.removeItem("token");
          setUser(null);
          
          qc.clear();
        }
        return Promise.reject(err);
      }
    );
    return () => axiosInstance.interceptors.response.eject(id);
  }, [qc]);

  
  useEffect(() => {
    let cancelled = false;
    (async function initAuth() {
      const token = localStorage.getItem("token");
      if (!token) {
        if (!cancelled) {
          setUser(null);
          setIsAuthLoading(false);
        }
        return;
      }
      try {
        const me = await axiosInstance.get("/api/auth/me");
        if (!cancelled) setUser(me.data);
      } catch {
        localStorage.removeItem("token");
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsAuthLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  
  const login = async ({ emailOrUsername, email, username, password }) => {
    const payload = { emailOrUsername, email, username, password };
    const res = await axiosInstance.post("/api/auth/login", payload); 
    const token = res?.data?.token;
    const usr   = res?.data?.user;

    if (token) localStorage.setItem("token", token);

    
    qc.clear();

    if (usr) {
      setUser(usr);
    } else {
      const me = await axiosInstance.get("/api/auth/me");
      setUser(me.data);
    }
    return res.data;
  };

  const signup = async ({ username, name, email, password }) => {
    const res = await axiosInstance.post("/api/auth/signup", {
      username, name: name ?? username, email, password
    });
    const token = res?.data?.token;
    const usr   = res?.data?.user;

    if (token) localStorage.setItem("token", token);

    
    qc.clear();

    if (usr) {
      setUser(usr);
    } else {
      const me = await axiosInstance.get("/api/auth/me");
      setUser(me.data);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    qc.clear(); 
  };

  const value = useMemo(
    () => ({ user, setUser, isAuthLoading, login, signup, logout }),
    [user, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
