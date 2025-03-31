import { API_ENDPOINTS, createHeaders } from "../config/api";

// Helper function to handle fetch responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export interface UserInfo {
  authenticated: boolean;
  name?: string;
  email?: string;
  picture?: string;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export const authService = {
  // Login with email and password
  login: async (credentials: LoginRequest): Promise<UserInfo> => {
    try {
      const response = await fetch(API_ENDPOINTS.auth.login, {
        method: "POST",
        credentials: "include",
        headers: createHeaders(),
        body: JSON.stringify(credentials),
      });
      
      const data = await handleResponse<UserInfo>(response);
      
      if (data.token) {
        localStorage.setItem('jwt_token', data.token);
      }
      
      return data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },
  
  // Register a new user
  register: async (userData: RegisterRequest): Promise<UserInfo> => {
    try {
      const response = await fetch(API_ENDPOINTS.auth.register, {
        method: "POST",
        credentials: "include",
        headers: createHeaders(),
        body: JSON.stringify(userData),
      });
      
      const data = await handleResponse<UserInfo>(response);
      
      if (data.token) {
        localStorage.setItem('jwt_token', data.token);
      }
      
      return data;
    } catch (error) {
      console.error("Error registering:", error);
      throw error;
    }
  },
  
  // Get current user
  getCurrentUser: async (): Promise<UserInfo> => {
    try {
      console.log("Getting current user...");
      // Check if we have a token in localStorage
      const token = localStorage.getItem('jwt_token');
      
      const response = await fetch(API_ENDPOINTS.auth.user, {
        method: "GET",
        credentials: "include",
        headers: {
          ...createHeaders(),
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      
      return handleResponse<UserInfo>(response);
    } catch (error) {
      console.error("Error getting current user:", error);
      return { authenticated: false };
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      // Clear token from localStorage
      localStorage.removeItem('jwt_token');
      
      const response = await fetch(API_ENDPOINTS.auth.logout, {
        method: "POST",
        credentials: "include",
        headers: createHeaders(),
      });
      await handleResponse(response);
    } catch (error) {
      console.error("Error logging out:", error);
      // Clear local storage even if server logout fails
      localStorage.removeItem('jwt_token');
      throw error;
    }
  },
};