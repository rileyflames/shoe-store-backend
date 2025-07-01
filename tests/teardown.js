import { teardownDB } from './setup.js';

export default async function globalTeardown() {
  await teardownDB();
};