import Cookies from "js-cookie";
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "./authType";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data: AuthResponse = await response.json();

    // Store token and user data in cookies
    this.setToken(data.data.token);
    this.setUser(data.data.User);

    return data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    const data: AuthResponse = await response.json();

    // Store token and user data in cookies
    this.setToken(data.data.token);
    this.setUser(data.data.User);

    return data;
  },

  logout(): void {
    Cookies.remove("auth_token");
    Cookies.remove("user_data");
  },

  setToken(token: string): void {
    Cookies.set("auth_token", token, {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  },

  getToken(): string | null {
    return Cookies.get("auth_token") || null;
  },

  setUser(user: any): void {
    Cookies.set("user_data", JSON.stringify(user), {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  },

  getUser(): any {
    const userData = Cookies.get("user_data");
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
