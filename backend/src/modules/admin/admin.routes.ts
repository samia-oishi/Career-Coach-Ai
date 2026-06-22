import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { getCollection } from '../../config/database.js';
import { requireAuth, requireRole } from '../../middleware/auth.middleware.js';
import { AppError } from '../../middleware/error.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import type { AiHistory, AppUser, Blog, Career, Review } from '../../types.js';
import { reviewApprovalSchema } from '../reviews/review.schemas.js';
import { roleUpdateSchema } from '../users/user.schemas.js';

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole('admin'));

adminRouter.get('/overview', asyncHandler(async (_req, res) => {
  const [users, careers, blogs, aiGenerations] = await Promise.all([
    getCollection<AppUser>('users').countDocuments(),
    getCollection<Career>('careers').countDocuments({ status: 'published' }),
    getCollection<Blog>('blogs').countDocuments({ status: 'published' }),
    getCollection<AiHistory>('aiHistory').countDocuments(),
  ]);
  sendSuccess(res, { users, careers, blogs, aiGenerations });
}));

adminRouter.get('/users', asyncHandler(async (_req, res) => {
  const users = await getCollection<AppUser>('users').find().sort({ createdAt: -1 }).limit(100).toArray();
  sendSuccess(res, users);
}));

adminRouter.patch('/users/:id/role', validate(roleUpdateSchema), asyncHandler(async (req, res) => {
  if (typeof req.params.id !== 'string' || !ObjectId.isValid(req.params.id)) throw new AppError(400, 'INVALID_ID', 'Invalid user id.');
  await getCollection<AppUser>('users').updateOne({ _id: new ObjectId(req.params.id as string) }, { $set: { role: req.body.role, updatedAt: new Date() } });
  sendSuccess(res, { updated: true });
}));

adminRouter.get('/careers', asyncHandler(async (_req, res) => {
  const careers = await getCollection<Career>('careers').find().sort({ createdAt: -1 }).toArray();
  sendSuccess(res, careers);
}));

adminRouter.get('/blogs', asyncHandler(async (_req, res) => {
  const blogs = await getCollection<Blog>('blogs').find().sort({ createdAt: -1 }).toArray();
  sendSuccess(res, blogs);
}));

adminRouter.get('/analytics', asyncHandler(async (_req, res) => {
  const byCategory = await getCollection<Career>('careers').aggregate([{ $match: { status: 'published' } }, { $group: { _id: '$category', count: { $sum: 1 } } }]).toArray();
  const savedByStatus = await getCollection('savedCareers').aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]).toArray();
  sendSuccess(res, { byCategory, savedByStatus });
}));

adminRouter.get('/ai-usage', asyncHandler(async (_req, res) => {
  const usage = await getCollection<AiHistory>('aiHistory').aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]).toArray();
  sendSuccess(res, usage);
}));

adminRouter.get('/content-review', asyncHandler(async (_req, res) => {
  const reviews = await getCollection<Review>('reviews').find({ isApproved: false }).sort({ createdAt: -1 }).limit(50).toArray();
  sendSuccess(res, reviews);
}));

adminRouter.get('/user-activity', asyncHandler(async (_req, res) => {
  const activity = await getCollection<AiHistory>('aiHistory').aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]).toArray();
  sendSuccess(res, activity);
}));

adminRouter.get('/reports', asyncHandler(async (_req, res) => {
  const [savedCareers, aiGenerations, reviews] = await Promise.all([
    getCollection('savedCareers').countDocuments(),
    getCollection<AiHistory>('aiHistory').countDocuments(),
    getCollection<Review>('reviews').countDocuments(),
  ]);
  sendSuccess(res, { savedCareers, aiGenerations, reviews });
}));

adminRouter.patch('/reviews/:id/approval', validate(reviewApprovalSchema), asyncHandler(async (req, res) => {
  if (typeof req.params.id !== 'string' || !ObjectId.isValid(req.params.id)) throw new AppError(400, 'INVALID_ID', 'Invalid review id.');
  await getCollection<Review>('reviews').updateOne({ _id: new ObjectId(req.params.id as string) }, { $set: { isApproved: req.body.isApproved, updatedAt: new Date() } });
  sendSuccess(res, { updated: true });
}));

adminRouter.get('/settings', asyncHandler(async (_req, res) => {
  sendSuccess(res, { aiProvider: 'gemini', appName: 'CareerCoach Ai' });
}));

adminRouter.patch('/settings', asyncHandler(async (_req, res) => {
  sendSuccess(res, { updated: true, message: 'Settings persistence can be extended when business rules are finalized.' });
}));
