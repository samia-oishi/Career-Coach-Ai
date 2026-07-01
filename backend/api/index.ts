import { connectDatabase } from '../src/config/database.js';
import { app } from '../src/app.js';

// Connect to database once on cold start
let isConnected = false;

const handler = async (req: any, res: any) => {
  if (!isConnected) {
    try {
      await connectDatabase();
      isConnected = true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return res.status(500).json({ 
        success: false, 
        error: { code: 'DB_ERROR', message: 'Database connection failed' } 
      });
    }
  }
  
  // Pass to Express app
  return app(req, res);
};

export default handler;
