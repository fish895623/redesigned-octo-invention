import { useState, useEffect, ReactNode } from "react";
import { User } from "../types/auth";
import { getCurrentUser, loginWithGoogle, logout as apiLogout } from "../api/auth";
import { AuthContext } from "./AuthContextDefinition";
import { useLocation } from "react-router-dom";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchUser = async () => {
    try {
      setLoading(true);
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Refresh user data when redirected from OAuth
  useEffect(() => {
    if (location.pathname === "/oauth/callback") {
      fetchUser();
    }
  }, [location.pathname]);

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
