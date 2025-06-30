import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.node,
    },
    plugins: { js },
    extends: ['js/recommended'],
    rules: {
      semi: ['warn', 'never'],
      quotes: ['warn', 'single', 'double'],
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
])
