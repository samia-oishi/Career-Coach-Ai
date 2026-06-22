import { z } from 'zod';

export const resumeSummarySchema = z.object({
  skills: z.array(z.string().min(1)).min(3, 'Add at least three skills.'),
  experience: z.string().min(20, 'Describe your experience in at least 20 characters.'),
  careerGoal: z.string().min(10, 'Describe your career goal.'),
});

export const careerRecommendationSchema = z.object({
  skills: z.array(z.string().min(1)).min(2),
  interests: z.array(z.string().min(1)).min(1),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
});
