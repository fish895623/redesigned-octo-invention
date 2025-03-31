import { createContext } from "react";
import { AuthContextType } from "../types/auth";

const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
  login: async () => ({ authenticated: false }),
  register: async () => ({ authenticated: false }),
  logout: async () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);