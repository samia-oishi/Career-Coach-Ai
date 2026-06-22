import type { NextFunction, Request, Response } from 'express';
import { AppError } from './error.middleware.js';

const hits = new Map<string, { count: number; resetAt: number }>();

export const rateLimit = (maxRequests = 120, windowMs = 60_000) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const record = hits.get(key);

    if (!record || record.resetAt < now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      throw new AppError(429, 'RATE_LIMITED', 'Too many requests. Please try again shortly.');
    }

    record.count += 1;
    next();
  };
};
