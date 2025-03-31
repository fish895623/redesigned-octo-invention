import { API_ENDPOINTS, createHeaders } from "../config/api";

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

class ApiClient {
  private static instance: ApiClient;
  private token: string | null = null;

  private constructor() {
    this.token = localStorage.getItem("token");
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  public setToken(token: string): void {
    this.token = token;
    localStorage.setItem("token", token);
  }

  public removeToken(): void {
    this.token = null;
    localStorage.removeItem("token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Only check token for non-auth endpoints
    if (
      !this.token &&
      endpoint !== API_ENDPOINTS.auth.login &&
      endpoint !== API_ENDPOINTS.auth.register
    ) {
      throw new Error("No authentication token available");
    }

    const headers = {
      ...createHeaders(),
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    // Handle authentication errors
    if (response.status === 401) {
      this.removeToken();
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    // Handle other errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return {
      data,
      status: response.status,
    };
  }

  public async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint);
  }

  public async post<T>(
    endpoint: string,
    body: unknown
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  public async put<T>(
    endpoint: string,
    body: unknown
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  public async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }
}

export const apiClient = ApiClient.getInstance();
