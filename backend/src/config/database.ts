import { MongoClient, type Collection, type Db, type Document } from 'mongodb';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let client: MongoClient | null = null;
let db: Db | null = null;

export const connectDatabase = async () => {
  if (db) return db;

  try {
    client = new MongoClient(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    });
    await client.connect();
    db = client.db();
    await createIndexes(db).catch((err) => {
      logger.warn('Index creation warning (non-fatal)', err);
    });
    logger.info('Database connected successfully');
    return db;
  } catch (error) {
    logger.error('Database connection failed', error);
    throw new Error('Failed to connect to database. Check your MONGODB_URI.');
  }
};

export const getDb = () => {
  if (!db) {
    throw new Error('Database is not connected');
  }

  return db;
};

export const getCollection = <T extends Document>(name: string): Collection<T> => {
  return getDb().collection<T>(name);
};

export const closeDatabase = async () => {
  await client?.close();
  client = null;
  db = null;
};

const createIndexes = async (database: Db) => {
  await Promise.all([
    database.collection('users').createIndex({ clerkId: 1 }, { unique: true, sparse: true }),
    database.collection('users').createIndex({ email: 1 }, { unique: true }),
    database.collection('users').createIndex({ role: 1 }),
    database.collection('careers').createIndex({ slug: 1 }, { unique: true }),
    database.collection('careers').createIndex({ title: 'text', description: 'text', category: 'text', requiredSkills: 'text' }),
    database.collection('careers').createIndex({ category: 1, difficulty: 1, status: 1 }),
    database.collection('blogs').createIndex({ slug: 1 }, { unique: true }),
    database.collection('blogs').createIndex({ title: 'text', excerpt: 'text', content: 'text', tags: 'text' }),
    database.collection('savedCareers').createIndex({ userId: 1, careerId: 1 }, { unique: true }),
    database.collection('reviews').createIndex({ careerId: 1, isApproved: 1 }),
    database.collection('aiHistory').createIndex({ userId: 1, type: 1, createdAt: -1 }),
  ]);
};
