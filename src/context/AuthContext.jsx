import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const checkAuth = async () => {
    try {
      await axios.get("http://localhost:3000/api/auth/me", {
        withCredentials: true,
      });
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth()
  }, []); 

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};