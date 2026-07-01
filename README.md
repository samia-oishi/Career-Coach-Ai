# CareerCoach Ai

CareerCoach Ai is an AI-powered full-stack career guidance application for discovering technology careers, generating resume summaries, receiving personalized career recommendations, saving career paths, and tracking a career journey through user and admin dashboards.

##Admin credentials
email: scribe.oishi@gmail.com
pass: SamiaAlamOishi123!

##User credentials
email: uiuxwip@gmail.com
pass: uiuxWip123!

## Tech Stack

### Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- ShadCN-style UI primitives
- HeroUI package available for approved UI usage
- React Hook Form
- Zod
- TanStack Query
- Axios
- Zustand
- Recharts
- Clerk authentication with Google login support

### Backend

- Express.js
- TypeScript
- MongoDB native driver
- Clerk backend token verification
- Zod validation
- Gemini AI API integration

## Project Structure

```text
Career-Coach-Ai/
  frontend/   # Next.js App Router frontend
  backend/    # Express TypeScript REST API
  .env.example
  README.md
```

## Current Features

- Premium public homepage with real Unsplash images.
- Sticky responsive navbar and footer.
- Careers listing with search, filters, sorting, pagination, skeleton state, and equal-height cards.
- Career detail pages with overview, skills, responsibilities, salary, growth, reviews placeholder, related careers, and save button.
- Saved Careers dashboard with list, status updates, and remove action.
- Blog, About, Contact, and FAQ pages.
- Clerk sign-in/sign-up routes.
- User dashboard with real saved-career count, AI generation count, profile completion, charts, and recent AI activity.
- Admin dashboard pages for users, careers, blogs, content review, user activity, reports, analytics, AI usage, and settings.
- Backend REST API with public, authenticated, and admin routes.
- MongoDB collections for users, careers, blogs, saved careers, reviews, and AI history.
- Seed script for 35 realistic technology careers and 8 blog articles.
- Required AI feature 1: Resume Summary Generator.
- Required AI feature 2: Career Recommendation Engine.
- Central validation, sanitization, rate limiting, and error handling.

## Local Setup

### 1. Install dependencies

From the project root:

```bash
npm install --prefix frontend
npm install --prefix backend
```

### 2. Create frontend environment file

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

The frontend uses Clerk server/client helpers, so the local frontend env includes both the publishable key and secret key. Keep `.env.local` private.

### 3. Create backend environment file

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/careercoach-ai
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash
FIRST_ADMIN_EMAIL=admin@example.com
```

`FIRST_ADMIN_EMAIL` becomes the first admin during user sync. Everyone else syncs as a normal user.

## Manual Setup Checklist

### MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Allow your current IP address in Network Access.
4. Copy the connection string.
5. Paste it into `backend/.env` as `MONGODB_URI`.

### Clerk

1. Create a Clerk application named `CareerCoach Ai`.
2. Enable email/password login.
3. Enable Google login.
4. Copy the Publishable Key into `frontend/.env.local`.
5. Copy the Secret Key into both `frontend/.env.local` and `backend/.env`.
6. Set sign-in URL to `/sign-in` and sign-up URL to `/sign-up`.
7. Create demo users if required.

### Gemini API

1. Open Google AI Studio.
2. Create an API key.
3. Paste it into `backend/.env` as `GEMINI_API_KEY`.
4. Restart the backend server.

## Run Locally

Start the backend:

```bash
npm --prefix backend run dev
```

Start the frontend in a second terminal:

```bash
npm --prefix frontend run dev
```

Open:

- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:5000/api/v1/health`

## Seed Data

After MongoDB is configured:

```bash
npm run seed
```

This seeds:

- 35 realistic technology careers.
- 8 realistic blog articles.

## Verification Commands

```bash
npm --prefix backend run type-check
npm --prefix frontend run type-check
npm --prefix backend run build
npm --prefix frontend run build
```

Note: frontend build may show a Recharts container-size warning during static generation. The build still completes successfully.

## AI Features

### Resume Summary Generator

Route:

```text
/dashboard/resume-summary
```

Input:

- Skills
- Experience or uploaded plain-text resume content
- Career goal

Output:

- Professional resume summary
- Suggested headline
- Key strengths
- Improvement tips

Safety rule: the prompt instructs AI not to invent degrees, employers, certifications, dates, or experience.

### Career Recommendation Engine

Route:

```text
/dashboard/recommendations
```

Input:

- Skills
- Interests
- Experience level

Output:

- Recommended careers from the existing catalog
- Match score
- Explanation
- Skills to improve
- Next steps

## Important Routes

Public:

- `/`
- `/careers`
- `/careers/[slug]`
- `/blog`
- `/blog/[slug]`
- `/about`
- `/contact`
- `/faq`

Authenticated user:

- `/dashboard`
- `/dashboard/saved-careers`
- `/dashboard/recommendations`
- `/dashboard/resume-summary`
- `/dashboard/profile`
- `/dashboard/settings`

Admin:

- `/admin`
- `/admin/users`
- `/admin/careers`
- `/admin/blogs`
- `/admin/content-review`
- `/admin/user-activity`
- `/admin/reports`
- `/admin/analytics`
- `/admin/ai-usage`
- `/admin/settings`

## Deployment

Recommended deployment:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Auth: Clerk

Before production deployment:

1. Rotate any secrets that were pasted into chat or shared during setup.
2. Create production Clerk keys.
3. Set backend environment variables on Render.
4. Set frontend environment variables on Vercel.
5. Set `FRONTEND_URL` in Render to the deployed Vercel URL.
6. Update Clerk allowed redirect URLs for production.
7. Seed production MongoDB only when you are ready.

## Demo Credentials

Create demo users in Clerk if required for submission:

```text
Demo User: user@example.com / your-password
Demo Admin: admin@example.com / your-password
```

Set `FIRST_ADMIN_EMAIL` to the demo admin email before the admin first signs in.
