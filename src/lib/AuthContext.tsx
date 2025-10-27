"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";

import {
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "./authType";
import { authService } from "./authServices";
import axiosInstance from "@/hooks/axiosInstance";
import { useRouter } from "next/navigation";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { user: User; token: string } }
  | { type: "AUTH_FAILURE" }
  | { type: "AUTH_LOGOUT" }
  | { type: "CLEAR_ERROR" };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, isLoading: true };
    case "AUTH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case "AUTH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case "AUTH_LOGOUT":
      return {
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case "CLEAR_ERROR":
      return { ...state };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const token = authService.getToken();
    const user = authService.getUser();

    if (token && user) {
      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user, token },
      });
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: "AUTH_START" });

      // Your API call here
      const response = await axiosInstance.post("auth/login", {
        uId: credentials.uId,
        password: credentials.password,
      });

      // Assuming your response has user data and token
      const user = response.data.data.User;
      const token = response.data.data.token;

      // Store the token and user in localStorage or cookies
      authService.setToken(token);
      authService.setUser(user);

      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user, token },
      });
      router.push("/");
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE" });
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      dispatch({ type: "AUTH_START" });
      const response = await authService.register(credentials);

      // Assuming your response has user data and token
      const { user, token } = response.data.data;

      // Store the token and user
      authService.setToken(token);
      authService.setUser(user);

      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user, token },
      });
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE" });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: "AUTH_LOGOUT" });
    router.refresh();
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
