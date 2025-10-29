// authType.ts
export interface LoginCredentials {
  uId: string;
  password: string;
}

export interface RegisterCredentials {
  uId: string;
  password: string;
  // add other registration fields as needed
}

export interface User {
  id: string;
  uId: string;
  name?: string;
  email: string;
  roles: string;
  department: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
