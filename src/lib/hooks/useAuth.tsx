import { useMutation, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agents";
import type { LoginFormType, RegisterFormType } from "../types/AuthForms"
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";
import { useAuthContext, type AuthUser } from "../contexts/AuthContext";

export const useAuth = () => {
  const { user, setUser, clearUser, isLoading } = useAuthContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Mutación para el login
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormType) => {
      console.log("Attempting login with:", data);
      const response = await agent.post("/auth/login", data);
      console.log("Login response:", response.data);
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
    onError: (error: unknown) => {
      const axiosError = error as { 
        message?: string; 
        response?: { 
          data?: unknown; 
          status?: number; 
          statusText?: string 
        } 
      };
      console.error("Login error details:", {
        message: axiosError.message,
        response: axiosError.response?.data,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormType) => {
      console.log("Attempting registration with:", data);
      
      // Convertir cell_phone de string a number
      const registrationData = {
        ...data,
        cell_phone: parseInt(data.cell_phone, 10)
      };
      
      console.log("Registration data after conversion:", registrationData);
      const response = await agent.post("/auth/register", registrationData);
      console.log("Registration response:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Registration successful:", data);
      navigate("/login");
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });

  const logout = () => {
    clearUser();
    
    // Limpiar todas las queries de React Query (incluyendo el carrito)
    queryClient.clear();
    
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