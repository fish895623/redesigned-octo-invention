import { User, LoginRequest, RegisterRequest } from "../types/auth";
import { API_ENDPOINTS, createHeaders } from "../config/api";

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await fetch(API_ENDPOINTS.auth.user, {
      method: "GET",
      credentials: "include",
      headers: createHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      authenticated: data.authenticated,
      name: data.name,
      email: data.email,
      picture: data.picture,
    };
  } catch (err) {
    console.error("Failed to check authentication status", err);
    return { authenticated: false };
  }
};

export const login = async (credentials: LoginRequest): Promise<User> => {
  try {
    const response = await fetch(API_ENDPOINTS.auth.login, {
      method: "POST",
      credentials: "include",
      headers: createHeaders(),
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      authenticated: data.authenticated,
      name: data.name,
      email: data.email,
      picture: data.picture,
    };
  } catch (err) {
    console.error("Login failed:", err);
    throw err;
  }
};

export const register = async (userData: RegisterRequest): Promise<User> => {
  try {
    const response = await fetch(API_ENDPOINTS.auth.register, {
      method: "POST",
      credentials: "include",
      headers: createHeaders(),
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      authenticated: data.authenticated,
      name: data.name,
      email: data.email,
      picture: data.picture,
    };
  } catch (err) {
    console.error("Registration failed:", err);
    throw err;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const response = await fetch(API_ENDPOINTS.auth.logout, {
      method: "POST",
      credentials: "include",
      headers: createHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    localStorage.removeItem("jwt_token");
    window.location.href = "/";
  } catch (err) {
    console.error("Logout failed:", err);
    throw err;
  }
};
