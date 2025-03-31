import { LoginRequest, RegisterRequest } from "../services/oauth2Service";

export interface User {
  authenticated: boolean;
  name?: string;
  email?: string;
  picture?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<User>;
  register: (userData: RegisterRequest) => Promise<User>;
  logout: () => Promise<void>;
}