import js from '@eslint/js';
import tseslint from 'typescript-eslint';
 
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
 ignores: [
  'node_modules/**',
  'allure-results/**',
  'allure-report/**',
  'env.test/**',
  'results/**',
  'batch/**',
  'artifacts/**',
  'storage-state/**'
 ],
    files: ['**/*.ts'],
    rules: {
      // your overrides
      // Example: 'semi': ['error', 'always'],
    }
  }
];