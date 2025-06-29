import api from "@/api/auth";
import { useState, useEffect } from "react";
import { User } from "@/lib/constant/type";

interface LoginResponse {
  token: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOnBoarded, setIsOnBoarded] = useState<boolean>(false);

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
      setIsOnBoarded(res.data.isOnboarding);
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post<LoginResponse>("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);  
      await fetchUser();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.msg || "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return { user, loading, login, logout, isOnBoarded };
}
