import { Router } from 'express';
import { getCollection } from '../../config/database.js';
import { env } from '../../config/env.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import type { AiHistory, Career } from '../../types.js';
import { careerRecommendationSchema, resumeSummarySchema } from './ai.schemas.js';
import { createCareerRecommendations, createResumeSummary } from './ai.service.js';

export const aiRouter = Router();

aiRouter.use(requireAuth);

aiRouter.post('/resume-summary', validate(resumeSummarySchema), asyncHandler(async (req, res) => {
  const output = await createResumeSummary(req.body);
  const result = await getCollection<AiHistory>('aiHistory').insertOne({
    userId: req.user!._id,
    type: 'resume_summary',
    input: req.body,
    output,
    provider: 'gemini',
    model: env.GEMINI_MODEL,
    status: 'success',
    createdAt: new Date(),
  });

  sendSuccess(res, { id: result.insertedId, ...output }, 201);
}));

aiRouter.post('/career-recommendations', validate(careerRecommendationSchema), asyncHandler(async (req, res) => {
  const careers = await getCollection<Career>('careers')
    .find({ status: 'published' })
    .project<Career>({ slug: 1, title: 1, category: 1, description: 1, requiredSkills: 1, difficulty: 1, demandScore: 1 })
    .toArray();

  const output = await createCareerRecommendations(req.body, careers);
  const result = await getCollection<AiHistory>('aiHistory').insertOne({
    userId: req.user!._id,
    type: 'career_recommendation',
    input: req.body,
    output,
    provider: 'gemini',
    model: env.GEMINI_MODEL,
    status: 'success',
    createdAt: new Date(),
  });

  sendSuccess(res, { id: result.insertedId, ...output }, 201);
}));

aiRouter.get('/history', asyncHandler(async (req, res) => {
  const history = await getCollection<AiHistory>('aiHistory')
    .find({ userId: req.user!._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();

  sendSuccess(res, history);
}));
