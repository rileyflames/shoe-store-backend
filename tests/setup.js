import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export async function setupDB() {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  return mongoServer;
}

export async function teardownDB(mongoServer) {
  await mongoose.disconnect();
  await mongoServer.stop();
}