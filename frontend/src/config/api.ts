export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

export const createHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  
  // Add Authorization header if token exists in localStorage
  const token = localStorage.getItem('jwt_token');
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
};

export const API_ENDPOINTS = {
  auth: {
    user: `${API_BASE_URL}/api/auth/user`,
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    logout: `${API_BASE_URL}/api/auth/logout`,
  },
} as const;