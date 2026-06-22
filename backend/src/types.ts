import type { ObjectId } from 'mongodb';

export type Role = 'user' | 'admin';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type PublishStatus = 'draft' | 'published' | 'archived';

export type AppUser = {
  _id?: ObjectId;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: Role;
  bio?: string;
  skills: string[];
  interests: string[];
  experienceLevel: Difficulty;
  careerGoal?: string;
  location?: string;
  settings: {
    theme: 'light' | 'dark' | 'system';
    emailNotifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type Career = {
  _id?: ObjectId;
  slug: string;
  title: string;
  category: string;
  description: string;
  overview: string;
  imageUrl: string;
  averageSalaryMin: number;
  averageSalaryMax: number;
  difficulty: Difficulty;
  demandScore: number;
  requiredSkills: string[];
  responsibilities: string[];
  salaryInformation: string;
  careerGrowth: string[];
  tools: string[];
  learningPath: string[];
  relatedCareerSlugs: string[];
  isFeatured: boolean;
  status: PublishStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type Blog = {
  _id?: ObjectId;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  category: string;
  tags: string[];
  authorName: string;
  readTimeMinutes: number;
  status: PublishStatus;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type SavedCareer = {
  _id?: ObjectId;
  userId: ObjectId;
  careerId: ObjectId;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'saved' | 'researching' | 'learning' | 'pursuing' | 'completed';
  createdAt: Date;
  updatedAt: Date;
};

export type Review = {
  _id?: ObjectId;
  userId: ObjectId;
  careerId: ObjectId;
  rating: number;
  title: string;
  comment: string;
  pros: string[];
  cons: string[];
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AiHistory = {
  _id?: ObjectId;
  userId: ObjectId;
  type: 'resume_summary' | 'career_recommendation' | 'career_chat';
  input: unknown;
  output?: unknown;
  provider: 'gemini';
  model: string;
  status: 'success' | 'failed';
  errorMessage?: string;
  createdAt: Date;
};
