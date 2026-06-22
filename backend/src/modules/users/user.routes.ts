import { verifyToken } from '@clerk/backend';
import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { env } from '../../config/env.js';
import { getCollection } from '../../config/database.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { AppError } from '../../middleware/error.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import type { AppUser } from '../../types.js';
import { settingsUpdateSchema, userSyncSchema, userUpdateSchema } from './user.schemas.js';

export const usersRouter = Router();

usersRouter.post('/sync', validate(userSyncSchema), asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token || !env.CLERK_SECRET_KEY) {
    throw new AppError(401, 'UNAUTHENTICATED', 'A valid Clerk session is required to sync a user.');
  }

  const payload = await verifyToken(token, { secretKey: env.CLERK_SECRET_KEY });

  if (payload.sub !== req.body.clerkId) {
    throw new AppError(403, 'SESSION_MISMATCH', 'The submitted user does not match the active Clerk session.');
  }

  const users = getCollection<AppUser>('users');
  const now = new Date();
  const role = req.body.email === env.FIRST_ADMIN_EMAIL ? 'admin' : 'user';

  await users.updateOne(
    { clerkId: payload.sub },
    {
      $set: {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        avatarUrl: req.body.avatarUrl,
        updatedAt: now,
      },
      $setOnInsert: {
        role,
        skills: [],
        interests: [],
        experienceLevel: 'beginner',
        settings: { theme: 'system' },
        createdAt: now,
      },
    },
    { upsert: true }
  );

  const user = await users.findOne({ clerkId: req.body.clerkId });
  sendSuccess(res, user, 201);
}));

usersRouter.get('/me', requireAuth, asyncHandler(async (req, res) => {
  sendSuccess(res, req.user);
}));

usersRouter.patch('/me', requireAuth, validate(userUpdateSchema), asyncHandler(async (req, res) => {
  await getCollection<AppUser>('users').updateOne(
    { _id: req.user!._id },
    { $set: { ...req.body, updatedAt: new Date() } }
  );
  const user = await getCollection<AppUser>('users').findOne({ _id: req.user!._id });
  sendSuccess(res, user);
}));

usersRouter.patch('/me/settings', requireAuth, validate(settingsUpdateSchema), asyncHandler(async (req, res) => {
  const set = Object.fromEntries(Object.entries(req.body).map(([key, value]) => [`settings.${key}`, value]));
  await getCollection<AppUser>('users').updateOne({ _id: req.user!._id }, { $set: { ...set, updatedAt: new Date() } });
  sendSuccess(res, { updated: true });
}));

export const getUserById = async (id: ObjectId) => getCollection<AppUser>('users').findOne({ _id: id });
