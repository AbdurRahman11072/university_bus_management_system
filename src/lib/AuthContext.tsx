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

// Extend AuthState to include survey data
interface ExtendedAuthState extends AuthState {
  surveyData: any;
  hasCompletedSurvey: boolean;
  isSurveyLoading: boolean;
}

interface AuthContextType extends ExtendedAuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (userData: User) => void;
  fetchSurveyData: () => Promise<void>;
  markSurveyAsCompleted: (surveyData?: any) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { user: User; token: string } }
  | { type: "AUTH_FAILURE" }
  | { type: "AUTH_LOGOUT" }
  | { type: "CLEAR_ERROR" }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "INITIAL_CHECK_COMPLETE" }
  | { type: "SURVEY_LOADING" }
  | { type: "SURVEY_SUCCESS"; payload: any }
  | { type: "SURVEY_FAILURE" }
  | { type: "SURVEY_COMPLETED"; payload?: any };

const authReducer = (
  state: ExtendedAuthState,
  action: AuthAction
): ExtendedAuthState => {
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
        initialCheckComplete: true,
      };
    case "AUTH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        initialCheckComplete: true,
      };
    case "AUTH_LOGOUT":
      return {
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        initialCheckComplete: true,
        surveyData: null,
        hasCompletedSurvey: false,
        isSurveyLoading: false,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "INITIAL_CHECK_COMPLETE":
      return {
        ...state,
        isLoading: false,
        initialCheckComplete: true,
      };
    case "SURVEY_LOADING":
      return {
        ...state,
        isSurveyLoading: true,
      };
    case "SURVEY_SUCCESS":
      return {
        ...state,
        isSurveyLoading: false,
        surveyData: action.payload,
        hasCompletedSurvey: true,
      };
    case "SURVEY_FAILURE":
      return {
        ...state,
        isSurveyLoading: false,
        surveyData: null,
        hasCompletedSurvey: false,
      };
    case "SURVEY_COMPLETED":
      return {
        ...state,
        surveyData: action.payload || state.surveyData,
        hasCompletedSurvey: true,
        isSurveyLoading: false,
      };
    case "CLEAR_ERROR":
      return { ...state };
    default:
      return state;
  }
};

const initialState: ExtendedAuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  initialCheckComplete: false,
  surveyData: null,
  hasCompletedSurvey: false,
  isSurveyLoading: false,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  // Function to fetch survey data - accepts userId as parameter
  // Function to fetch survey data - accepts userId as parameter
  const fetchSurveyData = async (userId?: string) => {
    const userToCheck = userId || state.user?.uId;

    if (!userToCheck) {
      console.log("❌ No user ID available for survey fetch");
      dispatch({ type: "SURVEY_FAILURE" });
      return null;
    }

    try {
      dispatch({ type: "SURVEY_LOADING" });

      console.log("📡 Fetching survey data for user:", userToCheck);
      const response = await axiosInstance.get(
        `survey/get-user/${userToCheck}`
      );

      console.log("📊 Full Survey API Response:", response);
      console.log("📋 Response data:", response.data);
      console.log("🎯 Survey data field:", response.data.data);

      // Check the actual survey data in response.data.data
      if (response.data.data !== null && response.data.data !== undefined) {
        console.log("✅ Survey completed - data found:", response.data.data);
        dispatch({
          type: "SURVEY_SUCCESS",
          payload: response.data.data,
        });
        return response.data.data;
      } else {
        console.log("❌ Survey not completed - data is null");
        dispatch({ type: "SURVEY_FAILURE" });
        return null;
      }
    } catch (error) {
      console.error("❌ Error fetching survey data:", error);
      dispatch({ type: "SURVEY_FAILURE" });
      return null;
    }
  };

  // Function to mark survey as completed
  const markSurveyAsCompleted = (surveyData?: any) => {
    console.log("🎉 Marking survey as completed with data:", surveyData);
    dispatch({
      type: "SURVEY_COMPLETED",
      payload: surveyData,
    });
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getToken();
        const user = authService.getUser();

        if (token && user) {
          console.log("✅ User found in storage:", user.uId);

          // Set auth state first
          dispatch({
            type: "AUTH_SUCCESS",
            payload: { user, token },
          });

          // Then fetch survey data with the user ID we know exists
          console.log("🕒 Fetching initial survey data for:", user.uId);
          await fetchSurveyData(user.uId);
        } else {
          console.log("❌ No user found in storage");
          dispatch({ type: "INITIAL_CHECK_COMPLETE" });
        }
      } catch (error) {
        console.error("❌ Error initializing auth:", error);
        authService.logout();
        dispatch({ type: "INITIAL_CHECK_COMPLETE" });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: "AUTH_START" });

      const response = await axiosInstance.post("auth/login", {
        uId: credentials.uId,
        password: credentials.password,
      });

      const user = response.data.data.User;
      const token = response.data.data.token;

      authService.setToken(token);
      authService.setUser(user);

      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user, token },
      });

      // Fetch survey data after login with the known user ID
      console.log("🔍 Checking survey status after login for:", user.uId);
      const surveyData = await fetchSurveyData(user.uId);

      // Redirect based on survey status
      if (surveyData) {
        console.log("✅ Survey completed, redirecting to home");
        router.push("/");
      } else {
        console.log("❌ Survey not completed, redirecting to survey page");
        router.push("/survey");
      }
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE" });
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      dispatch({ type: "AUTH_START" });
      const response = await authService.register(credentials);

      const { user, token } = response.data.data;

      authService.setToken(token);
      authService.setUser(user);

      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user, token },
      });

      // New users should complete survey
      console.log("👤 New user registered, redirecting to survey");
      router.push("/survey");
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE" });
      throw error;
    }
  };

  const logout = () => {
    console.log("🚪 Logging out user");
    authService.logout();
    dispatch({ type: "AUTH_LOGOUT" });
    router.push("/");
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const updateUser = (userData: User) => {
    console.log("📝 Updating user data");
    authService.setUser(userData);
    dispatch({ type: "UPDATE_USER", payload: userData });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
        updateUser,
        fetchSurveyData,
        markSurveyAsCompleted,
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
