import { useMutation } from "@tanstack/react-query";
import agent from "../api/agents";
import type { LoginFormType, RegisterFormType } from "../types/AuthForms"
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  fullName: string;
  token: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwtDecode(token);
        setUser({
          id: decoded.id,
          email: decoded.sub,
          role: decoded.role || "user",
          fullName: decoded.full_name || "",
          token,
        });
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);

  // Mutación para el login
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormType) => {
      const response = await agent.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded: any = jwtDecode(data.token);
      
      const authUser: AuthUser = {
        id: decoded.id,
        email: decoded.sub,
        role: data.role,
        fullName: data.full_name,
        token: data.token,
      };
      
      setUser(authUser);
      navigate("/");
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormType) => {
      const response = await agent.post("/auth/register", data);
      return response.data;
    },
    onSuccess: () => {
      navigate("/login");
    },
  });

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
    agent.get("/auth/logout");
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  return {
    user,
    isLoading,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    logout,
    getToken,
    isAdmin,
    authError: loginMutation.error || registerMutation.error,
  };
};