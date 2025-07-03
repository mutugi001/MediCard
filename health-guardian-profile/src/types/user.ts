
export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
};

export type UserLevel = {
  current: number;
  points: number;
  nextLevelPoints: number;
};

export type User = {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  role: 'team-lead' | 'member';
  avatarUrl: string;
  teamIds: string[];
  achievements: Achievement[];
  level: UserLevel;
  tasksCompleted: number;
  currentStreak: number;
  longestStreak: number;
};
