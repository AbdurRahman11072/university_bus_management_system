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
  _id: string;
  uId: string;
  name?: string;
  email: string;
  roles: "Student" | "Teacher" | "Driver" | "Admin";
  department: string;
  username: string;
  password: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  batchNo?: string;
  avatar_url?: string;
  isVerified: boolean;
  verificationImage?: string;
  phone_number?: string;
  driverLicence?: string;
  licenceExpire?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialCheckComplete: boolean;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  data?: any;
}
