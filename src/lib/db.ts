import mongoose from 'mongoose';

const mongoUri = process.env.MONGODB_URI || '';

if (!mongoUri) {
  console.warn('MONGODB_URI is not set. Set it in .env.local');
}

let cached = (global as any).mongoose as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached?.conn) return cached.conn;
  if (!cached?.promise) {
    const uri = mongoUri;
    cached!.promise = mongoose.connect(uri, { dbName: 'hackathon_platform' });
  }
  cached!.conn = await cached!.promise;
  return cached!.conn;
}
