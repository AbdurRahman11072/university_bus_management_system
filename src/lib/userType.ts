export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";
export type UserRole = "Student" | "Teacher" | "Driver" | "Admin";

export interface UserFormData {
  // Step 1
  uId: number;
  username: string;
  password: string;
  roles: UserRole;

  // Step 2
  avatar_url?: string;
  phone_number: string;
  bloodGroup: BloodGroup;

  // Role-specific fields
  verificationImage?: string; // For teachers
  driverLicence?: string; // For drivers
  licenceExpire?: string; // For drivers
}

export interface FormStep1Data {
  uId: number;
  username: string;
  password: string;
  roles: UserRole;
}

export type UserTypes = {
  uId: number;
  username: string;
  password: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  roles: "Student" | "Teacher" | "Driver" | "Admin";
  avatar_url?: string;
  verificationImage?: string;
  phone_number?: string;
  driverLicence?: string;
  licenceExpire?: string;
};
