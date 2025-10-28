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

export interface UserFormData extends FormStep1Data {
  phone_number: string;
  bloodGroup: BloodGroup;
  avatar_url?: string;
  verificationImage?: string;
  driverLicence?: string;
  licenceExpire?: string;
  batchNo?: string; // Add this
  department?: string; // Add this
}

export interface FormStep1Data {
  uId: number;
  username: string;
  password: string;
  roles: UserRole;
  email: string; // Add this
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
