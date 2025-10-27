export interface Notice {
  id: string;
  noticeFor: string;
  subject: string;
  description: string;
  seen: string[];
  createdAt?: string;
  updatedAt?: string;
}
// "Student" | "Teacher" | "Driver" | "All";
