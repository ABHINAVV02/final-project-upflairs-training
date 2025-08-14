import React, { createContext, useState, useEffect } from "react";
import { loginUser, logoutUser } from "../api/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");
    if (token && storedUser) {
      setAuthToken(token);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  
  const login = async (email, password) => {
    const result = await loginUser(email, password);
    if (result.ok) {
      const userData = { email, name: email.split("@")[0] };
      setAuthToken(result.token);
      setUser(userData);
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("authUser", JSON.stringify(userData));
      return { success: true };
    } else {
      return { success: false, message: "Invalid email or password" };
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    logoutUser();
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        user,
        isLoggedIn: !!authToken,
        login,
        logout,
        loading,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
