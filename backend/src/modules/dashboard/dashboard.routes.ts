import { Router } from 'express';
import { getCollection } from '../../config/database.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import type { AiHistory, SavedCareer } from '../../types.js';

export const dashboardRouter = Router();

dashboardRouter.use(requireAuth);

dashboardRouter.get('/user/overview', asyncHandler(async (req, res) => {
  const [savedCareers, aiGenerations, recentHistory] = await Promise.all([
    getCollection<SavedCareer>('savedCareers').countDocuments({ userId: req.user!._id }),
    getCollection<AiHistory>('aiHistory').countDocuments({ userId: req.user!._id }),
    getCollection<AiHistory>('aiHistory').find({ userId: req.user!._id }).sort({ createdAt: -1 }).limit(5).toArray(),
  ]);

  sendSuccess(res, {
    savedCareers,
    aiGenerations,
    profileCompletion: calculateProfileCompletion(req.user!),
    recentHistory,
  });
}));

dashboardRouter.get('/user/charts', asyncHandler(async (req, res) => {
  const savedByStatus = await getCollection<SavedCareer>('savedCareers')
    .aggregate([{ $match: { userId: req.user!._id } }, { $group: { _id: '$status', count: { $sum: 1 } } }])
    .toArray();

  const aiByType = await getCollection<AiHistory>('aiHistory')
    .aggregate([{ $match: { userId: req.user!._id } }, { $group: { _id: '$type', count: { $sum: 1 } } }])
    .toArray();

  sendSuccess(res, { savedByStatus, aiByType });
}));

const calculateProfileCompletion = (user: { skills: string[]; interests: string[]; bio?: string; careerGoal?: string; location?: string }) => {
  const checks = [user.skills.length > 0, user.interests.length > 0, Boolean(user.bio), Boolean(user.careerGoal), Boolean(user.location)];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
};
