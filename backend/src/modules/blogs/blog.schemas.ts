import { z } from 'zod';

export const blogQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(24).default(8),
});

export const blogCreateSchema = z.object({
  slug: z.string().min(2),
  title: z.string().min(5),
  excerpt: z.string().min(20),
  content: z.string().min(100),
  coverImageUrl: z.string().url(),
  category: z.string().min(2),
  tags: z.array(z.string()).min(1),
  authorName: z.string().min(2),
  readTimeMinutes: z.number().int().positive(),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
  publishedAt: z.coerce.date().default(() => new Date()),
});

export const blogUpdateSchema = blogCreateSchema.partial();
