import { teardownDB } from './setup.js';

export default async function globalTeardown() {
  await teardownDB();
};


// globalSetup: Starts an in-memory MongoDB before all tests.
// globalTeardown: Stops MongoDB and disconnects after all tests.
// This ensures a clean database for each test run.