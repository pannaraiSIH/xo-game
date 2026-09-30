import { UserRole } from "./enums";

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface UserScore {
  totalScore: number;
  currentStreak: number;
  hasBonus: boolean;
  updatedAt: Date;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export interface UserScores {
  user: User;
  currentStreak: number;
  totalScore: number;
  updatedAt: Date;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
