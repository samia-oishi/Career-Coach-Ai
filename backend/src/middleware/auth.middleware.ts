import { verifyToken } from '@clerk/backend';
import type { NextFunction, Request, Response } from 'express';
import type { ObjectId } from 'mongodb';
import { getCollection } from '../config/database.js';
import { env } from '../config/env.js';
import { AppError } from './error.middleware.js';
import type { AppUser, Role } from '../types.js';

declare global {
  namespace Express {
    interface Request {
      user?: AppUser & { _id: ObjectId };
      auth?: { clerkId: string; email?: string };
    }
  }
}


export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    throw new AppError(401, 'UNAUTHENTICATED', 'Please sign in to continue.');
  }

  if (!env.CLERK_SECRET_KEY) {
    throw new AppError(500, 'AUTH_NOT_CONFIGURED', 'Authentication is not configured on the server.');
  }

  const payload = await verifyToken(token, { secretKey: env.CLERK_SECRET_KEY });
  const clerkId = payload.sub;

  if (!clerkId) {
    throw new AppError(401, 'INVALID_TOKEN', 'Your session could not be verified.');
  }

  const users = getCollection<AppUser>('users');
  const user = await users.findOne({ clerkId });

  if (!user?._id) {
    throw new AppError(404, 'USER_NOT_SYNCED', 'Your account is not synced yet. Please refresh and try again.');
  }

  req.auth = { clerkId };
  req.user = user as AppUser & { _id: ObjectId };
  next();
};

export const optionalAuth = async (req: Request, _res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token || !env.CLERK_SECRET_KEY) return next();

  try {
    const payload = await verifyToken(token, { secretKey: env.CLERK_SECRET_KEY });
    const user = await getCollection<AppUser>('users').findOne({ clerkId: payload.sub });
    if (user?._id) req.user = user as AppUser & { _id: ObjectId };
  } catch {
    // Public routes should continue when optional auth fails.
  }

  next();
};

export const requireRole = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHENTICATED', 'Please sign in to continue.');
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(403, 'FORBIDDEN', 'You do not have permission to access this resource.');
    }

    next();
  };
};
