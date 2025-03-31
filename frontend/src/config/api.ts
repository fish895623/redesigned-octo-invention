export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const API_ENDPOINTS = {
  auth: {
    user: `${API_BASE_URL}/api/auth/user`,
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    logout: `${API_BASE_URL}/api/auth/logout`,
  },
  projects: {
    list: `${API_BASE_URL}/api/projects`,
    create: `${API_BASE_URL}/api/projects`,
    update: `${API_BASE_URL}/api/projects`,
    delete: `${API_BASE_URL}/api/projects`,
  },
  milestones: {
    create: `${API_BASE_URL}/api/projects`,
    update: `${API_BASE_URL}/api/projects`,
    delete: `${API_BASE_URL}/api/projects`,
  },
  tasks: {
    create: `${API_BASE_URL}/api/projects`,
    update: `${API_BASE_URL}/api/projects`,
    delete: `${API_BASE_URL}/api/projects`,
  },
} as const;

export const createHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};
