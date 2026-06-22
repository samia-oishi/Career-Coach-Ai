export type Career = {
  _id?: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  overview: string;
  imageUrl: string;
  averageSalaryMin: number;
  averageSalaryMax: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  demandScore: number;
  requiredSkills: string[];
  responsibilities: string[];
  salaryInformation: string;
  careerGrowth: string[];
  tools: string[];
  learningPath: string[];
  relatedCareerSlugs: string[];
  isFeatured: boolean;
};

export type Blog = {
  _id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  category: string;
  tags: string[];
  authorName: string;
  readTimeMinutes: number;
  publishedAt: string;
};

export type AppUser = {
  _id?: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
  bio?: string;
  skills: string[];
  interests: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  careerGoal?: string;
  location?: string;
  settings?: { theme?: 'light' | 'dark' | 'system' };
};

export type SavedCareer = {
  _id: string;
  careerId: string;
  career: Career;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'saved' | 'researching' | 'learning' | 'pursuing' | 'completed';
  createdAt?: string;
  updatedAt?: string;
};

export type DashboardOverview = {
  savedCareers: number;
  aiGenerations: number;
  profileCompletion: number;
  recentHistory: Array<{ _id?: string; type: string; createdAt: string }>;
};

export type DashboardCharts = {
  savedByStatus: Array<{ _id: string; count: number }>;
  aiByType: Array<{ _id: string; count: number }>;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};
