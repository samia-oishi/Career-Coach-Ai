import { z } from 'zod';

export const reviewCreateSchema = z.object({
  careerId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(4).max(120),
  comment: z.string().min(20).max(1200),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
});

export const reviewUpdateSchema = reviewCreateSchema.omit({ careerId: true }).partial();

export const reviewApprovalSchema = z.object({
  isApproved: z.boolean(),
});
