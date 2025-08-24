module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  rules: {
    // General rules
    'no-console': 'off', // Allow console.log in server code
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    
    // TypeScript specific rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    
    // Import rules
    'sort-imports': ['error', { 'ignoreDeclarationSort': true }],
    
    // Error handling
    'no-throw-literal': 'error',
    'prefer-promise-reject-errors': 'error',
    
    // API and Express specific
    'no-process-exit': 'error',
    'no-process-env': 'off', // We use process.env for configuration
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/__tests__/**/*'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'no-console': 'off',
      },
    },
  ],
};