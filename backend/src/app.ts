import express from 'express';
import { env } from './config/env.js';
import { rateLimit } from './middleware/rate-limit.middleware.js';
import { sanitizeBody } from './middleware/sanitize.middleware.js';
import { errorMiddleware, notFoundHandler } from './middleware/error.middleware.js';
import { sendSuccess } from './utils/response.js';
import { usersRouter } from './modules/users/user.routes.js';
import { careersRouter } from './modules/careers/career.routes.js';
import { blogsRouter } from './modules/blogs/blog.routes.js';
import { savedCareersRouter } from './modules/saved-careers/savedCareer.routes.js';
import { reviewsRouter } from './modules/reviews/review.routes.js';
import { aiRouter } from './modules/ai/ai.routes.js';
import { dashboardRouter } from './modules/dashboard/dashboard.routes.js';
import { adminRouter } from './modules/admin/admin.routes.js';

export const app = express();

// CORS configuration for multiple origins (local + Vercel deployments)
const allowedOrigins = [
  'http://localhost:3000',
  env.FRONTEND_URL,
].filter(Boolean);

// Add Vercel preview URLs pattern if frontend is on Vercel
if (env.FRONTEND_URL && env.FRONTEND_URL.includes('vercel.app')) {
  const baseUrl = env.FRONTEND_URL.replace(/-git-[\w-]+/, '');
  allowedOrigins.push(baseUrl);
}

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.some(allowed => origin === allowed || origin.startsWith(allowed.replace(/\/+$/, '')))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (origin && (origin.includes('vercel.app') || origin.includes('localhost'))) {
    // Allow all Vercel preview deployments and localhost
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', env.FRONTEND_URL || '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: '1mb' }));
app.use(rateLimit());
app.use(sanitizeBody);

app.get('/', (_req, res) => sendSuccess(res, { status: 'ok', app: 'CareerCoach Ai API', health: '/api/v1/health' }));
app.get('/health', (_req, res) => sendSuccess(res, { status: 'ok', app: 'CareerCoach Ai' }));
app.get('/api/v1/health', (_req, res) => sendSuccess(res, { status: 'ok', app: 'CareerCoach Ai' }));

app.post('/api/v1/contact', (req, res) => {
  sendSuccess(res, { received: true, message: 'Thanks for contacting CareerCoach Ai. We will respond soon.' }, 201);
});

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/careers', careersRouter);
app.use('/api/v1/blogs', blogsRouter);
app.use('/api/v1/saved-careers', savedCareersRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/admin', adminRouter);

app.use(notFoundHandler);
app.use(errorMiddleware);
