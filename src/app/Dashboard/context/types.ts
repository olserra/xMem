export interface Project {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string; // ISO string for Date
  updatedAt: string; // ISO string for Date
} 