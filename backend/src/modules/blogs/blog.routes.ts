import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { getCollection } from '../../config/database.js';
import { requireAuth, requireRole } from '../../middleware/auth.middleware.js';
import { AppError } from '../../middleware/error.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import type { Blog } from '../../types.js';
import { blogCreateSchema, blogQuerySchema, blogUpdateSchema } from './blog.schemas.js';

export const blogsRouter = Router();

blogsRouter.get('/', validate(blogQuerySchema, 'query'), asyncHandler(async (req, res) => {
  const query = req.validated?.query as z.infer<typeof blogQuerySchema>;
  const filter: Record<string, unknown> = { status: 'published' };
  if (query.search) filter.$text = { $search: query.search };
  if (query.category) filter.category = query.category;

  const skip = (query.page - 1) * query.limit;
  const blogs = getCollection<Blog>('blogs');
  const [items, total] = await Promise.all([
    blogs.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(query.limit).toArray(),
    blogs.countDocuments(filter),
  ]);

  sendSuccess(res, { items, total, page: query.page, totalPages: Math.ceil(total / query.limit) });
}));

blogsRouter.get('/featured', asyncHandler(async (_req, res) => {
  const items = await getCollection<Blog>('blogs').find({ status: 'published' }).sort({ publishedAt: -1 }).limit(3).toArray();
  sendSuccess(res, items);
}));

blogsRouter.get('/:slug', asyncHandler(async (req, res) => {
  const blog = await getCollection<Blog>('blogs').findOne({ slug: req.params.slug, status: 'published' });
  if (!blog) throw new AppError(404, 'BLOG_NOT_FOUND', 'Blog article was not found.');
  sendSuccess(res, blog);
}));

blogsRouter.post('/', requireAuth, requireRole('admin'), validate(blogCreateSchema), asyncHandler(async (req, res) => {
  const now = new Date();
  const result = await getCollection<Blog>('blogs').insertOne({ ...req.body, createdAt: now, updatedAt: now });
  sendSuccess(res, { id: result.insertedId }, 201);
}));

blogsRouter.patch('/:id', requireAuth, requireRole('admin'), validate(blogUpdateSchema), asyncHandler(async (req, res) => {
  if (typeof req.params.id !== 'string' || !ObjectId.isValid(req.params.id)) throw new AppError(400, 'INVALID_ID', 'Invalid blog id.');
  await getCollection<Blog>('blogs').updateOne({ _id: new ObjectId(req.params.id as string) }, { $set: { ...req.body, updatedAt: new Date() } });
  sendSuccess(res, { updated: true });
}));

blogsRouter.delete('/:id', requireAuth, requireRole('admin'), asyncHandler(async (req, res) => {
  if (typeof req.params.id !== 'string' || !ObjectId.isValid(req.params.id)) throw new AppError(400, 'INVALID_ID', 'Invalid blog id.');
  await getCollection<Blog>('blogs').updateOne({ _id: new ObjectId(req.params.id as string) }, { $set: { status: 'archived', updatedAt: new Date() } });
  sendSuccess(res, { deleted: true });
}));
