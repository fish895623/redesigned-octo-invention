import { User, LoginRequest, RegisterRequest } from "../types/auth";
import { API_ENDPOINTS } from "../config/api";
import { apiClient } from "./apiClient";

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get<User>(API_ENDPOINTS.auth.user);
    if (response.data.authenticated) {
      return response.data;
    } else {
      return { authenticated: false };
    }
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
    if (
      response.data.authenticated &&
      response.data.accessToken &&
      response.data.refreshToken
    ) {
      apiClient.setTokens(
        response.data.accessToken,
        response.data.refreshToken
      );
    } else {
      apiClient.removeTokens();
    }
    return response.data;
  } catch (err) {
    console.error("Login failed:", err);
    apiClient.removeTokens();
    throw err;
  }
};

export const register = async (userData: RegisterRequest): Promise<User> => {
  try {
    const response = await apiClient.post<User>(
      API_ENDPOINTS.auth.register,
      userData
    );
    if (
      response.data.authenticated &&
      response.data.accessToken &&
      response.data.refreshToken
    ) {
      apiClient.setTokens(
        response.data.accessToken,
        response.data.refreshToken
      );
    } else {
      apiClient.removeTokens();
    }
    return response.data;
  } catch (err) {
    console.error("Registration failed:", err);
    apiClient.removeTokens();
    throw err;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post(API_ENDPOINTS.auth.logout, {});
    apiClient.removeTokens();
  } catch (err) {
    console.error("Logout failed:", err);
    // Still remove tokens on the client side even if server request fails
    apiClient.removeTokens();
  }
};
