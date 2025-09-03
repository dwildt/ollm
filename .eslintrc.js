module.exports = {
  root: true,
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    // Custom rules for modular architecture
    'prefer-const': 'error',
    'no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' 
    }],
    
    // React specific rules for component modularity
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-uses-vars': 'error',
    'react/no-unused-state': 'error',
    
    // Hooks rules for custom hooks (useChat, useChatMessages, etc.)
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // Import rules for modular components
    'import/no-unused-modules': 'off', // Disabled to allow gradual refactoring
    'import/prefer-default-export': 'off', // Allow named exports for modular components
    
    // TypeScript rules
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    
    // Component organization rules
    'jsx-a11y/accessible-emoji': 'off', // Allow emojis in UI
    'jsx-a11y/anchor-is-valid': 'warn',
  },
  
  // Override for test files
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.test.{js,jsx,ts,tsx}'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'react-hooks/exhaustive-deps': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off'
      }
    },
    {
      files: ['**/*.tsx', '**/*.ts'],
      rules: {
        // Future rules for modular components
        // These can be uncommented when implementing modular architecture
        // 'react/function-component-definition': ['error', {
        //   'namedComponents': 'arrow-function',
        //   'unnamedComponents': 'arrow-function'
        // }]
      }
    }
  ],
  
  settings: {
    react: {
      version: 'detect'
    }
  },
  
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  }
};