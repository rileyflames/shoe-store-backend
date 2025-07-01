export default {
  testEnvironment: 'node',
  transform: {}, // No transform needed for ES modules
  extensionsToTreatAsEsm: ['.js'],
  verbose: true,
  globalSetup: './tests/setup.js',
  globalTeardown: './tests/teardown.js',
};



// testEnvironment: 'node': Runs tests in a Node.js environment.
// transform: {}: No transformation needed for ES modules.
// verbose: true: Shows detailed test output.
// globalSetup/globalTeardown: Initializes and cleans up the in-memory MongoDB.