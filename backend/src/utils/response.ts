import type { Response } from 'express';

export type ApiErrorBody = {
  code: string;
  message: string;
  details?: unknown;
};

export const sendSuccess = <T>(res: Response, data: T, status = 200) => {
  return res.status(status).json({ success: true, data });
};

export const sendError = (res: Response, error: ApiErrorBody, status = 500) => {
  return res.status(status).json({ success: false, error });
};
