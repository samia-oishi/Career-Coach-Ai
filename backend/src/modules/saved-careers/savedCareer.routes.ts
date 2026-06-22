import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { getCollection } from '../../config/database.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { AppError } from '../../middleware/error.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import type { Career, SavedCareer } from '../../types.js';
import { savedCareerCreateSchema, savedCareerUpdateSchema } from './savedCareer.schemas.js';

export const savedCareersRouter = Router();

savedCareersRouter.use(requireAuth);

savedCareersRouter.get('/', asyncHandler(async (req, res) => {
  const saved = await getCollection<SavedCareer>('savedCareers')
    .aggregate([
      { $match: { userId: req.user!._id } },
      { $lookup: { from: 'careers', localField: 'careerId', foreignField: '_id', as: 'career' } },
      { $unwind: '$career' },
      { $sort: { updatedAt: -1 } },
    ])
    .toArray();

  sendSuccess(res, saved);
}));

savedCareersRouter.post('/', validate(savedCareerCreateSchema), asyncHandler(async (req, res) => {
  if (!ObjectId.isValid(req.body.careerId)) throw new AppError(400, 'INVALID_CAREER', 'Invalid career id.');
  const careerId = new ObjectId(req.body.careerId);
  const career = await getCollection<Career>('careers').findOne({ _id: careerId, status: 'published' });
  if (!career) throw new AppError(404, 'CAREER_NOT_FOUND', 'Career path was not found.');

  const now = new Date();
  await getCollection<SavedCareer>('savedCareers').updateOne(
    { userId: req.user!._id, careerId },
    { $set: { ...req.body, careerId, updatedAt: now }, $setOnInsert: { userId: req.user!._id, createdAt: now } },
    { upsert: true }
  );

  sendSuccess(res, { saved: true }, 201);
}));

savedCareersRouter.patch('/:id', validate(savedCareerUpdateSchema), asyncHandler(async (req, res) => {
  if (typeof req.params.id !== 'string' || !ObjectId.isValid(req.params.id)) throw new AppError(400, 'INVALID_ID', 'Invalid saved career id.');
  const result = await getCollection<SavedCareer>('savedCareers').updateOne(
    { _id: new ObjectId(req.params.id as string), userId: req.user!._id },
    { $set: { ...req.body, updatedAt: new Date() } }
  );
  if (!result.matchedCount) throw new AppError(404, 'SAVED_CAREER_NOT_FOUND', 'Saved career was not found.');
  sendSuccess(res, { updated: true });
}));

savedCareersRouter.delete('/:id', asyncHandler(async (req, res) => {
  if (typeof req.params.id !== 'string' || !ObjectId.isValid(req.params.id)) throw new AppError(400, 'INVALID_ID', 'Invalid saved career id.');
  await getCollection<SavedCareer>('savedCareers').deleteOne({ _id: new ObjectId(req.params.id as string), userId: req.user!._id });
  sendSuccess(res, { deleted: true });
}));
