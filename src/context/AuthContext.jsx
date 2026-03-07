import { createContext, useState, useEffect } from "react";
import instance from "../utils/axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const checkAuth = async () => {
    try {
      await instance.get("api/auth/me");
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