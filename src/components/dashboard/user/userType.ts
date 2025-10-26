// userType.ts
export interface UserData {
  uId: number;
  _id?: string; // Add this for MongoDB ID
  username: string;
  email: string;
  password: string;
  avatar_url?: string;
  phone_number?: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  roles: "Student" | "Teacher" | "Driver" | "Admin";
  createdAt?: string;
  updatedAt?: string;
}
