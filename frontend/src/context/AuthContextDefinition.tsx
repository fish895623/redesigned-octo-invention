import { createContext, useContext } from "react";
import { AuthContextType } from "../types/auth";

const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
  login: async () => ({ authenticated: false }),
  register: async () => ({ authenticated: false }),
  logout: async () => {},
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
