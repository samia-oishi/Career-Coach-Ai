import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { getCollection } from '../../config/database.js';
import { requireAuth, requireRole } from '../../middleware/auth.middleware.js';
import { AppError } from '../../middleware/error.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import type { Career, Review } from '../../types.js';
import { careerCreateSchema, careerQuerySchema, careerUpdateSchema } from './career.schemas.js';

export const careersRouter = Router();

careersRouter.get('/', validate(careerQuerySchema, 'query'), asyncHandler(async (req, res) => {
  const query = req.validated?.query as z.infer<typeof careerQuerySchema>;
  const filter: Record<string, unknown> = { status: 'published' };

  if (query.search) filter.$text = { $search: query.search };
  if (query.category) filter.category = query.category;
  if (query.difficulty) filter.difficulty = query.difficulty;
  if (query.salaryMin || query.salaryMax) {
    filter.averageSalaryMax = { $gte: query.salaryMin ?? 0 };
    if (query.salaryMax) filter.averageSalaryMin = { $lte: query.salaryMax };
  }

  const sort: Record<string, 1 | -1> = query.sort === 'title'
    ? { title: 1 }
    : query.sort === 'salary'
      ? { averageSalaryMax: -1 }
      : query.sort === 'newest'
        ? { createdAt: -1 }
        : { demandScore: -1 };

  const skip = (query.page - 1) * query.limit;
  const careers = getCollection<Career>('careers');
  const [items, total] = await Promise.all([
    careers.find(filter).sort(sort).skip(skip).limit(query.limit).toArray(),
    careers.countDocuments(filter),
  ]);

  sendSuccess(res, { items, total, page: query.page, totalPages: Math.ceil(total / query.limit) });
}));

careersRouter.get('/featured', asyncHandler(async (_req, res) => {
  const items = await getCollection<Career>('careers')
    .find({ status: 'published', isFeatured: true })
    .sort({ demandScore: -1 })
    .limit(8)
    .toArray();

  sendSuccess(res, items);
}));

careersRouter.get('/categories', asyncHandler(async (_req, res) => {
  const categories = await getCollection<Career>('careers').distinct('category', { status: 'published' });
  sendSuccess(res, categories.sort());
}));

careersRouter.get('/:slug', asyncHandler(async (req, res) => {
  const career = await getCollection<Career>('careers').findOne({ slug: req.params.slug, status: 'published' });
  if (!career) throw new AppError(404, 'CAREER_NOT_FOUND', 'Career path was not found.');
  sendSuccess(res, career);
}));

careersRouter.get('/:slug/reviews', asyncHandler(async (req, res) => {
  const career = await getCollection<Career>('careers').findOne({ slug: req.params.slug, status: 'published' });
  if (!career?._id) throw new AppError(404, 'CAREER_NOT_FOUND', 'Career path was not found.');

  const reviews = await getCollection<Review>('reviews')
    .find({ careerId: career._id, isApproved: true })
    .sort({ createdAt: -1 })
    .toArray();

  sendSuccess(res, reviews);
}));

careersRouter.post('/', requireAuth, requireRole('admin'), validate(careerCreateSchema), asyncHandler(async (req, res) => {
  const now = new Date();
  const result = await getCollection<Career>('careers').insertOne({ ...req.body, createdAt: now, updatedAt: now });
  sendSuccess(res, { id: result.insertedId }, 201);
}));

careersRouter.patch('/:id', requireAuth, requireRole('admin'), validate(careerUpdateSchema), asyncHandler(async (req, res) => {
  if (typeof req.params.id !== 'string' || !ObjectId.isValid(req.params.id)) throw new AppError(400, 'INVALID_ID', 'Invalid career id.');
  await getCollection<Career>('careers').updateOne(
    { _id: new ObjectId(req.params.id as string) },
    { $set: { ...req.body, updatedAt: new Date() } }
  );
  sendSuccess(res, { updated: true });
}));

careersRouter.delete('/:id', requireAuth, requireRole('admin'), asyncHandler(async (req, res) => {
  if (typeof req.params.id !== 'string' || !ObjectId.isValid(req.params.id)) throw new AppError(400, 'INVALID_ID', 'Invalid career id.');
  await getCollection<Career>('careers').updateOne(
    { _id: new ObjectId(req.params.id as string) },
    { $set: { status: 'archived', updatedAt: new Date() } }
  );
  sendSuccess(res, { deleted: true });
}));
