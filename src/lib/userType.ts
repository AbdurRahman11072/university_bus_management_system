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
  _id: string;
  uId: string;
  username: string;
  email: string;
  roles: "Student" | "Teacher" | "Driver" | "Admin";
  phone_number?: string;
  bloodGroup?: string;
  avatar_url?: string;
  batchNo?: string;
  department?: string;
  driverLicence?: string;
  licenceExpire?: string;
  createdAt?: string;
  updatedAt?: string;
};
