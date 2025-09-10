module.exports = {
  // Frontend
  'frontend/src/**/*.{ts,tsx}': [
    'cd frontend && npm run lint:fix'
  ],
  // Backend  
  'backend/src/**/*.ts': [
<<<<<<< HEAD
    'cd backend && npm run lint:fix',
    'cd backend && npm run type-check'
  ],
  // Security audit on package.json changes
  'package.json': [
    'npm run security'
  ],
  'frontend/package.json': [
    'cd frontend && npm audit'
  ],
  'backend/package.json': [
    'cd backend && npm audit'
  ],
  // Testes apenas se arquivos de teste foram modificados
  'frontend/src/**/*.test.{ts,tsx}': [
    'cd frontend && npm run test:coverage -- --passWithNoTests'
  ],
  'backend/src/**/*.test.ts': [
    'cd backend && npm test -- --passWithNoTests'
=======
    'cd backend && npm run lint:fix'
>>>>>>> f8ed67c (chore: atualizar TypeScript 5 e corrigir testes)
  ]
};