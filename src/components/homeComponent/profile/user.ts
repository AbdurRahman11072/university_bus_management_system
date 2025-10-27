export interface UserData {
  uId: number;
  username: string;
  email: string;
  password: string;
  avatar_url?: string;
  phone_number?: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  roles: "Student" | "Teacher" | "Driver" | "All";
  createdAt?: string;
  updatedAt?: string;
}
