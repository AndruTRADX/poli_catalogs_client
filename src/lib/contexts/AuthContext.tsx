import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from "jwt-decode";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  fullName: string;
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  clearUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const value = {
    user,
    isLoading,
    setUser,
    clearUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 