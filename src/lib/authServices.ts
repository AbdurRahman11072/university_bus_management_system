import Cookies from "js-cookie";
import fetchWithToast from "@/hooks/fetchWrapper";
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "./authType";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetchWithToast(`${API_BASE_URL}/auth/login`, {
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
    const response = await fetchWithToast(`${API_BASE_URL}/auth/register`, {
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
    // Normalize isVerified to boolean to avoid type mismatches across code
    const normalized = { ...user } as any;
    const v: any = normalized?.isVerified;
    if (v === true || v === 1 || v === "1" || v === "true" || v === "yes") {
      normalized.isVerified = true;
    } else {
      normalized.isVerified = false;
    }

    Cookies.set("user_data", JSON.stringify(normalized), {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  },

  getUser(): any {
    const userData = Cookies.get("user_data");
    if (!userData) return null;
    try {
      const parsed = JSON.parse(userData);
      // Ensure isVerified is boolean
      const v: any = parsed?.isVerified;
      if (v === true || v === 1 || v === "1" || v === "true" || v === "yes") {
        parsed.isVerified = true;
      } else {
        parsed.isVerified = false;
      }
      return parsed;
    } catch (e) {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
