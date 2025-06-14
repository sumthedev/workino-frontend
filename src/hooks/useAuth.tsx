// hooks/useAuth.ts - Fixed version
import api from "@/api/auth";
import { useState, useEffect } from "react";
import { User } from "@/lib/constant/type";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);

  const fetchUser = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await api.get("/user/profile");
      setUser(res.data);
      console.log("User fetched successfully:", res.data);
    } catch (err:any) {
      console.error("Failed to fetch user:", err);
      

      if (err.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem("token");
        }
      }
      
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        fetchUser();
      } else {
        setLoading(false);
      }
      setInitialized(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post<LoginResponse>("/auth/login", { email, password });
      
      if (typeof window !== 'undefined') {
        localStorage.setItem("token", res.data.token);
      }
      
      await fetchUser();
      return { success: true };
    } catch (err:any) {
      console.error("Login failed:", err);
      return { 
        success: false, 
        error: err.response?.data?.msg || "Login failed" 
      };
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token");
    }
    setUser(null);
  };

  return { user, loading, initialized, login, logout };
}