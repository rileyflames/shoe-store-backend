// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node', // For Node.js/Express
    globals: true, // Enables describe, it, expect without imports
    setupFiles: ['./tests/setup.js'], // Your MongoDB setup
    include: ['tests/**/*.test.js'], // Test file pattern
    coverage: {
      provider: 'v8', // Native Node.js coverage
      reporter: ['text', 'html'], // Coverage report formats
    },
  },
});