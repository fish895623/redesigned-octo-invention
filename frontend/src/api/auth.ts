import { User, LoginRequest, RegisterRequest } from "../types/auth";
import { API_ENDPOINTS } from "../config/api";
import { apiClient } from "./apiClient";

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get<User>(API_ENDPOINTS.auth.user);
    return response.data;
  } catch (err) {
    console.error("Failed to check authentication status", err);
    return { authenticated: false };
  }
};

export const login = async (credentials: LoginRequest): Promise<User> => {
  try {
    const response = await apiClient.post<User>(
      API_ENDPOINTS.auth.login,
      credentials
    );
    if (response.data.authenticated) {
      apiClient.setToken(response.data.token || "");
    }
    return response.data;
  } catch (err) {
    console.error("Login failed:", err);
    throw err;
  }
};

export const register = async (userData: RegisterRequest): Promise<User> => {
  try {
    const response = await apiClient.post<User>(
      API_ENDPOINTS.auth.register,
      userData
    );
    if (response.data.authenticated) {
      apiClient.setToken(response.data.token || "");
    }
    return response.data;
  } catch (err) {
    console.error("Registration failed:", err);
    throw err;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post(API_ENDPOINTS.auth.logout, {});
    apiClient.removeToken();
    window.location.href = "/login";
  } catch (err) {
    console.error("Logout failed:", err);
    throw err;
  }
};
