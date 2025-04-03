export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  auth: {
    user: `${API_BASE_URL}/api/auth/user`,
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    logout: `${API_BASE_URL}/api/auth/logout`,
    refresh: `${API_BASE_URL}/api/auth/refresh`,
  },
  projects: {
    list: `${API_BASE_URL}/api/projects`,
    detail: (id: number) => `${API_BASE_URL}/api/projects/${id}`,
    create: `${API_BASE_URL}/api/projects`,
    update: (id: number) => `${API_BASE_URL}/api/projects/${id}`,
    delete: (id: number) => `${API_BASE_URL}/api/projects/${id}`,
  },
  milestones: {
    list: (projectId: number) => `${API_BASE_URL}/api/projects/${projectId}/milestones`,
    detail: (projectId: number, milestoneId: number) =>
      `${API_BASE_URL}/api/projects/${projectId}/milestones/${milestoneId}`,
    create: (projectId: number) => `${API_BASE_URL}/api/projects/${projectId}/milestones`,
    update: (projectId: number, milestoneId: number) =>
      `${API_BASE_URL}/api/projects/${projectId}/milestones/${milestoneId}`,
    delete: (projectId: number, milestoneId: number) =>
      `${API_BASE_URL}/api/projects/${projectId}/milestones/${milestoneId}`,
  },
  tasks: {
    list: (projectId: number) => `${API_BASE_URL}/api/projects/${projectId}/tasks`,
    listByMilestone: (projectId: number, milestoneId: number) =>
      `${API_BASE_URL}/api/projects/${projectId}/milestones/${milestoneId}/tasks`,
    detail: (projectId: number, taskId: number) => `${API_BASE_URL}/api/projects/${projectId}/tasks/${taskId}`,
    create: (projectId: number) => `${API_BASE_URL}/api/projects/${projectId}/tasks`,
    update: (projectId: number, taskId: number) => `${API_BASE_URL}/api/projects/${projectId}/tasks/${taskId}`,
    delete: (projectId: number, taskId: number) => `${API_BASE_URL}/api/projects/${projectId}/tasks/${taskId}`,
  },
} as const;

export const createHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};
