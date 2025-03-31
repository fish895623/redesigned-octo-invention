export interface User {
  authenticated: boolean;
  name?: string;
  email?: string;
  picture?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => void;
  logout: () => void;
}
