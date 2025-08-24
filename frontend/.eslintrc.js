module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  rules: {
    // Custom rules that extend React App defaults
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': 'off', // TypeScript handles this
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react/jsx-uses-react': 'off', // Not needed in React 17+
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react-hooks/exhaustive-deps': 'warn',
    'jsx-a11y/anchor-is-valid': 'warn',
    
    // Specific rules for our project
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    
    // TypeScript specific rules
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
    
    // React specific rules
    'react/prop-types': 'off', // TypeScript handles this
    'react/self-closing-comp': 'error',
    'react/jsx-boolean-value': 'error',
    'react/jsx-curly-brace-presence': ['error', 'never'],
    'react/jsx-fragments': ['error', 'syntax'],
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/__tests__/**/*'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': 'off',
      },
    },
  ],
};