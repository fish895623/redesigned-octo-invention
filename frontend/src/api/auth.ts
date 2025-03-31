import { User } from "../types/auth";
import { API_ENDPOINTS, createHeaders } from "../config/api";

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await fetch(API_ENDPOINTS.auth.user, {
      method: "GET",
      credentials: "include",
      headers: createHeaders(),
    });
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

export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<User> => {
  try {
    const response = await fetch(API_ENDPOINTS.auth.login, {
      method: "POST",
      credentials: "include",
      headers: createHeaders(),
      body: JSON.stringify(credentials),
    });
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

export const register = async (userData: {
  email: string;
  password: string;
  name: string;
}): Promise<User> => {
  try {
    const response = await fetch(API_ENDPOINTS.auth.register, {
      method: "POST",
      credentials: "include",
      headers: createHeaders(),
      body: JSON.stringify(userData),
    });
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
    await fetch(API_ENDPOINTS.auth.logout, {
      method: "POST",
      credentials: "include",
      headers: createHeaders(),
    });
    localStorage.removeItem("jwt_token");
    window.location.href = "/";
  } catch (err) {
    console.error("Logout failed:", err);
    throw err;
  }
};
