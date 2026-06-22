import { z } from 'zod';

export const userSyncSchema = z.object({
  clerkId: z.string().min(1),
  email: z.string().email(),
  firstName: z.string().default('Career'),
  lastName: z.string().default('Explorer'),
  avatarUrl: z.string().url().optional(),
  selectedRole: z.enum(['user']).default('user'),
});

export const userUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  bio: z.string().max(500).optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  careerGoal: z.string().max(300).optional(),
  location: z.string().max(120).optional(),
});

export const settingsUpdateSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
});

export const roleUpdateSchema = z.object({
  role: z.enum(['user', 'admin']),
});
