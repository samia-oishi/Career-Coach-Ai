import type { ErrorRequestHandler } from 'express';
import { sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
  }
}

export const notFoundHandler = () => {
  throw new AppError(404, 'NOT_FOUND', 'The requested resource was not found.');
};

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    return sendError(res, { code: error.code, message: error.message, details: error.details }, error.statusCode);
  }

  logger.error('Unhandled server error', error);
  return sendError(res, { code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong. Please try again.' }, 500);
};
