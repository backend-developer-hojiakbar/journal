import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import apiClient from '../api/axiosConfig';

interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Clear any existing localStorage token on app start to prevent conflicts
  const [token, setToken] = useState<string | null>(() => {
    // Remove any legacy localStorage token
    localStorage.removeItem('token');
    // Use sessionStorage for session-based authentication
    return sessionStorage.getItem('token');
  });

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('token', token);
      // Ensure localStorage doesn't have conflicting token
      localStorage.removeItem('token');
    } else {
      sessionStorage.removeItem('token');
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (username: string, password: string) => {
    try {
      const response = await apiClient.post('/get-token/', { username, password });
      setToken(response.data.token);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    // Ensure complete cleanup of any stored tokens
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};