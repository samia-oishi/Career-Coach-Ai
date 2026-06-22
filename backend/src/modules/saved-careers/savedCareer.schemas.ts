import { z } from 'zod';

export const savedCareerCreateSchema = z.object({
  careerId: z.string().min(1),
  notes: z.string().max(500).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  status: z.enum(['saved', 'researching', 'learning', 'pursuing', 'completed']).default('saved'),
});

export const savedCareerUpdateSchema = z.object({
  notes: z.string().max(500).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  status: z.enum(['saved', 'researching', 'learning', 'pursuing', 'completed']).optional(),
});
