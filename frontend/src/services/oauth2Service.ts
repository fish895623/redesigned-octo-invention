import { API_BASE_URL, createHeaders } from "../config/api";

// Helper function to handle fetch responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export interface OAuth2Response {
  redirectUrl: string;
}

export interface UserInfo {
  authenticated: boolean;
  name?: string;
  email?: string;
  picture?: string;
}

export const oauth2Service = {
  // Initiate Google OAuth2 flow
  initiateGoogleLogin: async (): Promise<void> => {
    try {
      // Directly redirect to the backend OAuth2 endpoint
      window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
    } catch (error) {
      console.error("Error initiating Google login:", error);
      throw error;
    }
  },

  // Handle OAuth2 callback
  handleCallback: async (): Promise<void> => {
    try {
      // Get the user info
      const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
        method: "GET",
        credentials: "include",
        headers: createHeaders(),
      });
      await handleResponse(response);
    } catch (error) {
      console.error("Error handling OAuth callback:", error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<UserInfo> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
        method: "GET",
        credentials: "include",
        headers: createHeaders(),
      });
      return await handleResponse<UserInfo>(response);
    } catch (error) {
      console.error("Error fetching current user:", error);
      return { authenticated: false };
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: createHeaders(),
      });
      await handleResponse(response);
      window.location.href = "/";
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  },
};
