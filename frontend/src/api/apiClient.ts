import { API_ENDPOINTS, createHeaders } from "../config/api";

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

class ApiClient {
  private static instance: ApiClient;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<boolean> | null = null;

  private constructor() {
    this.accessToken = localStorage.getItem("accessToken");
    this.refreshToken = localStorage.getItem("refreshToken");
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  public removeTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      if (this.refreshPromise) {
        return this.refreshPromise;
      }

      this.refreshPromise = new Promise((resolve) => {
        try {
          fetch(API_ENDPOINTS.auth.refresh, {
            method: "POST",
            headers: {
              ...createHeaders(),
            },
            body: JSON.stringify({ refreshToken: this.refreshToken }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to refresh token");
              }
              return response.json();
            })
            .then((data) => {
              this.accessToken = data.accessToken;
              localStorage.setItem("accessToken", data.accessToken);
              resolve(true);
            })
            .catch((error) => {
              console.error("Token refresh failed:", error);
              this.removeTokens();
              resolve(false);
            })
            .finally(() => {
              this.refreshPromise = null;
            });
        } catch (error) {
          console.error("Token refresh failed:", error);
          this.removeTokens();
          resolve(false);
          this.refreshPromise = null;
        }
      });

      return this.refreshPromise;
    } catch (error) {
      console.error("Error refreshing token:", error);
      this.removeTokens();
      return false;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryWithRefresh = true
  ): Promise<ApiResponse<T>> {
    const headers = {
      ...createHeaders(),
      ...(this.accessToken
        ? { Authorization: `Bearer ${this.accessToken}` }
        : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(endpoint, {
        ...options,
        headers,
      });

      // If token expired and we have a refresh token, try to refresh
      if (response.status === 401 && this.refreshToken && retryWithRefresh) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry the request with the new token
          return this.request<T>(endpoint, options, false);
        } else {
          // Redirect to login
          window.location.href = "/login";
          throw new Error("Session expired. Please login again.");
        }
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
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred");
    }
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
