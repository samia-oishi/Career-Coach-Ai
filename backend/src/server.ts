import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { app } from './app.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  await connectDatabase();
  app.listen(env.PORT, () => {
    logger.info(`CareerCoach Ai API running on http://localhost:${env.PORT}`);
  });
};

startServer().catch((error) => {
  logger.error('Failed to start API server', error);
  process.exit(1);
});
