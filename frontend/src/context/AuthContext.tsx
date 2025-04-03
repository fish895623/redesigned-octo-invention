import { useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, RegisterRequest } from '../types/auth';
import { getCurrentUser, login as apiLogin, logout as apiLogout, register as apiRegister } from '../api/auth';
import { AuthContext } from './AuthContextDefinition';
import { useLocation } from 'react-router-dom';

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
      console.error('Failed to fetch user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Refresh user data when redirected from authentication
  useEffect(() => {
    if (location.pathname === '/oauth/callback') {
      fetchUser();
    }
  }, [location.pathname]);

  const login = async (credentials: LoginRequest) => {
    try {
      const userData = await apiLogin(credentials);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      return { authenticated: false };
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      const newUser = await apiRegister(userData);
      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Registration failed:', error);
      return { authenticated: false };
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
