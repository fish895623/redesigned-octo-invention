import { User } from "../types/auth";
import { LoginRequest, RegisterRequest, authService } from "../services/oauth2Service";

export const getCurrentUser = async (): Promise<User> => {
  try {
    const data = await authService.getCurrentUser();
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
    const data = await authService.login(credentials);
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
    const data = await authService.register(userData);
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
    await authService.logout();
  } catch (err) {
    console.error("Logout failed:", err);
  }
};