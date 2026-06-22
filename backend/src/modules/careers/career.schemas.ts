import { z } from 'zod';

export const careerQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
  sort: z.enum(['title', 'salary', 'demand', 'newest']).default('demand'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
});

export const careerCreateSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  category: z.string().min(2),
  description: z.string().min(20),
  overview: z.string().min(50),
  imageUrl: z.string().url(),
  averageSalaryMin: z.number().positive(),
  averageSalaryMax: z.number().positive(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  demandScore: z.number().min(1).max(100),
  requiredSkills: z.array(z.string()).min(3),
  responsibilities: z.array(z.string()).min(3),
  salaryInformation: z.string().min(20),
  careerGrowth: z.array(z.string()).min(2),
  tools: z.array(z.string()).min(2),
  learningPath: z.array(z.string()).min(2),
  relatedCareerSlugs: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
});

export const careerUpdateSchema = careerCreateSchema.partial();
