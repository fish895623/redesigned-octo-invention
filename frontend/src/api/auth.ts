import { User } from "../types/auth";

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await fetch("/api/auth/user", {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        authenticated: data.authenticated,
        name: data.name,
        email: data.email,
        picture: data.picture,
      };
    } else {
      return { authenticated: false };
    }
  } catch (err) {
    console.error("Failed to check authentication status", err);
    return { authenticated: false };
  }
};

export const loginWithGoogle = () => {
  window.location.href = "/oauth2/authorization/google";
};

export const logout = async (): Promise<void> => {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    window.location.href = "/";
  } catch (err) {
    console.error("Logout failed:", err);
  }
};
