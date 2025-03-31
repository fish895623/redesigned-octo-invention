import { createContext } from "react";
import { AuthContextType } from "../types/auth";

const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
  loginWithGoogle: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);
