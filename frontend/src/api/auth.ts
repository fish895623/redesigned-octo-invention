import { User } from "../types/auth";
import { oauth2Service } from "../services/oauth2Service";

export const getCurrentUser = async (): Promise<User> => {
  try {
    const data = await oauth2Service.getCurrentUser();
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

export const loginWithGoogle = () => {
  oauth2Service.initiateGoogleLogin();
};

export const logout = async (): Promise<void> => {
  try {
    await oauth2Service.logout();
  } catch (err) {
    console.error("Logout failed:", err);
  }
};
