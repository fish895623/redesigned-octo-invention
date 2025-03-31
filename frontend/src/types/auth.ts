export interface User {
  authenticated: boolean;
  name?: string;
  email?: string;
  picture?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<User>;
  register: (userData: any) => Promise<User>;
  logout: () => Promise<void>;
}
