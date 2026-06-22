import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { AppError } from './error.middleware.js';

declare global {
  namespace Express {
    interface Request {
      validated?: {
        body?: unknown;
        query?: unknown;
        params?: unknown;
      };
    }
  }
}

export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Please check the submitted information.', result.error.flatten());
    }

    req.validated = { ...req.validated, [source]: result.data };

    if (source === 'body') {
      req.body = result.data;
    }

    next();
  };
};
