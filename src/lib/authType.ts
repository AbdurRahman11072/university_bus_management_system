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
  // add other user properties as needed
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
