import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { getCollection } from '../../config/database.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { AppError } from '../../middleware/error.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import type { Career, Review } from '../../types.js';
import { reviewCreateSchema, reviewUpdateSchema } from './review.schemas.js';

export const reviewsRouter = Router();

reviewsRouter.get('/career/:careerId', asyncHandler(async (req, res) => {
  const careerId = req.params.careerId as string;
  if (!ObjectId.isValid(careerId)) throw new AppError(400, 'INVALID_CAREER', 'Invalid career id.');
  
  const reviews = await getCollection<Review>('reviews')
    .aggregate([
      { $match: { careerId: new ObjectId(careerId), isApproved: true } },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { _id: 1, rating: 1, title: 1, comment: 1, pros: 1, cons: 1, createdAt: 1, 'user.firstName': 1, 'user.lastName': 1 } },
      { $sort: { createdAt: -1 } },
    ])
    .toArray();
  
  sendSuccess(res, reviews);
}));

reviewsRouter.post('/', requireAuth, validate(reviewCreateSchema), asyncHandler(async (req, res) => {
  if (!ObjectId.isValid(req.body.careerId)) throw new AppError(400, 'INVALID_CAREER', 'Invalid career id.');
  const careerId = new ObjectId(req.body.careerId);
  const career = await getCollection<Career>('careers').findOne({ _id: careerId, status: 'published' });
  if (!career) throw new AppError(404, 'CAREER_NOT_FOUND', 'Career path was not found.');

  const now = new Date();
  const result = await getCollection<Review>('reviews').insertOne({
    ...req.body,
    careerId,
    userId: req.user!._id,
    isApproved: false,
    createdAt: now,
    updatedAt: now,
  });

  sendSuccess(res, { id: result.insertedId }, 201);
}));

reviewsRouter.patch('/:id', requireAuth, validate(reviewUpdateSchema), asyncHandler(async (req, res) => {
  if (typeof req.params.id !== 'string' || !ObjectId.isValid(req.params.id)) throw new AppError(400, 'INVALID_ID', 'Invalid review id.');
  const result = await getCollection<Review>('reviews').updateOne(
    { _id: new ObjectId(req.params.id as string), userId: req.user!._id },
    { $set: { ...req.body, isApproved: false, updatedAt: new Date() } }
  );
  if (!result.matchedCount) throw new AppError(404, 'REVIEW_NOT_FOUND', 'Review was not found.');
  sendSuccess(res, { updated: true });
}));

reviewsRouter.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
  if (typeof req.params.id !== 'string' || !ObjectId.isValid(req.params.id)) throw new AppError(400, 'INVALID_ID', 'Invalid review id.');
  await getCollection<Review>('reviews').deleteOne({ _id: new ObjectId(req.params.id as string), userId: req.user!._id });
  sendSuccess(res, { deleted: true });
}));
