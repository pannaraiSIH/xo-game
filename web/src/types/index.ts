export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
}

export interface UserScore {
  totalScore: number;
  currentStreak: number;
  updatedAt: Date;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export interface UserScores {
  user: User;
  totalScore: number;
  updatedAt: Date;
}
