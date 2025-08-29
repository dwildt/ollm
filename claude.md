# Claude Development Guidelines for OLLM

This document outlines the key architectural decisions, coding standards, and development guidelines for the OLLM (Ollama Chat Interface) project. Follow these guidelines to maintain consistency and quality when extending or modifying the codebase.

## Architecture Overview

### Project Structure
- **Monorepo approach**: Frontend and backend in separate folders with shared root configuration
- **TypeScript everywhere**: Both frontend and backend use TypeScript for type safety
- **Clean separation**: Frontend handles UI/UX, backend handles API and Ollama integration
- **RESTful API**: Simple REST endpoints for communication between frontend and backend

### Frontend Architecture (React + TypeScript)
- **Component-based**: Each UI element is a reusable React component
- **Custom hooks**: Use React hooks for state management and side effects
- **Service layer**: API calls abstracted into service modules
- **Type-safe**: All components and functions have proper TypeScript types

### Backend Architecture (Node.js + Express)
- **Minimal and focused**: Single-purpose Express server
- **Direct HTTP API integration**: Direct integration with Ollama via HTTP API (no LlamaIndex dependency)
- **Error handling**: Comprehensive error handling for Ollama connectivity issues
- **Environment driven**: All configuration through environment variables

## Coding Standards

### General Principles
1. **Simplicity over complexity**: Prefer simple, readable solutions
2. **Type safety first**: Always use TypeScript types and interfaces
3. **No comments policy**: Code should be self-documenting through good naming
4. **Consistent formatting**: Use standard TypeScript/React formatting
5. **Error handling**: Always handle potential errors gracefully

### File Organization
```
src/
├── components/     # Reusable UI components
├── services/       # API and external service integrations  
├── types/          # TypeScript type definitions
├── i18n/          # Internationalization files
└── styles/        # CSS files (keep with components)
```

### Naming Conventions
- **Components**: PascalCase (`ChatInterface`, `MessageList`)
- **Functions/Variables**: camelCase (`sendMessage`, `isLoading`)
- **Files**: PascalCase for components, camelCase for utilities
- **CSS Classes**: kebab-case (`chat-container`, `message-bubble`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `DEFAULT_MODEL`)

### Component Guidelines
- Keep components small and focused (under 200 lines)
- Use functional components with hooks
- Props should have explicit TypeScript interfaces
- Handle loading and error states in UI components
- Make components responsive by default

### State Management
- Use React's built-in state management (useState, useEffect)
- No external state management libraries (Redux, Zustand) unless absolutely necessary
- Keep state close to where it's used
- Lift state up only when multiple components need it

## Development Guidelines

### Adding New Features

1. **Plan the API first**: Define the backend endpoints before frontend implementation
2. **Types first**: Create TypeScript interfaces for all data structures
3. **Component breakdown**: Break down complex UIs into smaller components
4. **Test manually**: Ensure features work with real Ollama instances
5. **Error scenarios**: Test disconnected/error states

### Internationalization (i18n)

#### Adding New Strings
1. Add keys to both `en.json` and `pt.json` in `frontend/src/i18n/locales/`
2. Use the `useTranslation` hook: `const { t } = useTranslation()`
3. Reference strings with dot notation: `t('chat.inputPlaceholder')`
4. Keep keys descriptive and hierarchical

#### Adding New Languages
1. Create new locale file: `frontend/src/i18n/locales/[code].json`
2. Register in `frontend/src/i18n/index.ts`
3. Update `LanguageSwitcher` component
4. Test with actual translations, not machine translations when possible

### API Development

#### Backend Endpoints
- Keep endpoints simple and RESTful
- Always return consistent JSON structure
- Include proper HTTP status codes
- Handle Ollama connectivity issues gracefully

#### Error Responses
```typescript
{
  error: "Human readable error message",
  code?: "ERROR_CODE_FOR_FRONTEND",
  details?: any // Additional error details
}
```

#### Success Responses
```typescript
{
  data: any, // The actual response data
  message?: "Optional success message"
}
```

### Styling Guidelines

#### CSS Organization
- Keep styles close to components
- Use CSS custom properties for theme values
- Mobile-first responsive design
- Prefer flexbox and grid for layouts

#### Design Principles
- Clean, minimal interface
- High contrast for accessibility
- Consistent spacing using 8px grid
- Smooth transitions and interactions
- Loading states for all async operations

## Testing Strategy

### Manual Testing Checklist
- [ ] Test with Ollama running and stopped
- [ ] Test with multiple models
- [ ] Test language switching
- [ ] Test responsive behavior on mobile
- [ ] Test keyboard shortcuts (Enter, Shift+Enter)
- [ ] Test error states and recovery
- [ ] Test chat clearing functionality

### Browser Testing
- Test on Chrome, Firefox, Safari
- Test on iOS Safari and Chrome mobile
- Ensure proper viewport behavior

## Performance Considerations

### Frontend Optimization
- Minimize re-renders with proper dependency arrays
- Use React.memo for expensive components
- Lazy load components when applicable
- Optimize image assets if added

### Backend Optimization  
- Keep API responses lean
- Use appropriate timeout values for Ollama calls
- Cache model list when possible
- Graceful degradation when Ollama is slow

## Security Considerations

### Frontend Security
- Sanitize user inputs (handled by React by default)
- No sensitive data in localStorage
- Use HTTPS in production

### Backend Security
- Validate all inputs
- No user data persistence
- CORS properly configured
- Rate limiting if needed in production

## Deployment Guidelines

### Environment Variables
Always use environment variables for:
- API URLs and ports
- Model configurations  
- Feature flags
- Third-party service credentials

### Production Checklist
- [ ] Build optimized frontend bundle
- [ ] Configure production environment variables
- [ ] Test with production Ollama setup
- [ ] Ensure proper error logging
- [ ] Configure reverse proxy if needed

## Extension Points

### Adding New AI Providers
1. Create new service in `backend/src/services/`
2. Implement common interface for model interaction
3. Add provider selection in frontend
4. Update environment configuration

### Adding New UI Features
1. Design component interfaces first
2. Create reusable components
3. Add proper TypeScript types
4. Include internationalization
5. Test responsive behavior

### Adding New Message Types
1. Extend `Message` type in `frontend/src/types/`
2. Update chat rendering logic
3. Add backend support if needed
4. Consider mobile display implications

## Common Patterns

### Error Handling Pattern
```typescript
try {
  const result = await apiCall();
  // Handle success
} catch (error) {
  console.error('Operation failed:', error);
  // Show user-friendly error message
  // Don't break the UI
}
```

### Loading State Pattern
```typescript
const [isLoading, setIsLoading] = useState(false);

const handleAction = async () => {
  setIsLoading(true);
  try {
    await performAction();
  } finally {
    setIsLoading(false);
  }
};
```

### Internationalization Pattern
```typescript
const { t } = useTranslation();
return <button>{t('chat.sendButton')}</button>;
```

## Maintenance

### Regular Maintenance Tasks
- Update dependencies monthly
- Test with latest Ollama versions
- Review and update documentation
- Monitor for security vulnerabilities
- Clean up unused code and dependencies

### Code Review Focus Areas
- Type safety and interface compliance
- Error handling completeness
- Mobile responsiveness
- Internationalization coverage
- Performance implications of changes

## Testing Strategy and Requirements

### Testing Philosophy
Testing is **MANDATORY** for all new features and changes. The project follows a comprehensive testing approach with multiple layers to ensure reliability and maintainability.

### Testing Structure

#### Frontend Testing (Jest + React Testing Library)
- **Location**: `frontend/src/**/__tests__/` and `*.test.tsx` files
- **Coverage**: All components, services, hooks, and utilities must have tests
- **Requirements**:
  - Unit tests for all React components with user interaction scenarios
  - Service layer tests with API mocking
  - Integration tests for complex component interactions
  - Accessibility testing where applicable
  - Minimum 80% code coverage for new code

#### Backend Testing (Jest + Supertest)
- **Location**: `backend/src/**/__tests__/` and `*.test.ts` files  
- **Coverage**: All API endpoints, services, and business logic
- **Requirements**:
  - API endpoint tests with various input scenarios
  - Error handling and validation testing
  - Ollama integration testing with mocks
  - Database/external service mocking
  - Minimum 80% code coverage for new code

#### End-to-End Testing (Playwright)
- **Location**: `e2e/` directory at project root
- **Coverage**: Complete user workflows and critical paths
- **Requirements**:
  - Full chat functionality workflows
  - Language switching and internationalization
  - Model selection and switching
  - Error states and recovery
  - Mobile and desktop responsiveness
  - Cross-browser compatibility (Chrome, Firefox, Safari)

### Testing Commands

```bash
# Run all tests
npm run test

# Frontend unit tests
npm run test:frontend

# Backend unit tests  
npm run test:backend

# End-to-end tests
npm run test:e2e

# Run with UI for debugging
npm run test:e2e:ui

# Get coverage reports
cd frontend && npm run test:coverage
cd backend && npm run test:coverage
```

### Development Workflow

#### Before Implementing New Features
1. **Write tests first** (TDD approach recommended)
2. Ensure tests fail appropriately before implementation
3. Implement feature to make tests pass
4. Refactor while keeping tests green

#### For Bug Fixes
1. Write a failing test that reproduces the bug
2. Fix the bug to make the test pass
3. Ensure no regression in existing tests

#### Before Committing Code
1. **ALWAYS** run `npm run quality` which includes:
   - TypeScript type checking
   - ESLint validation
   - All test suites
2. Ensure all tests pass
3. Verify code coverage requirements are met
4. Fix any linting errors

### Testing Guidelines for New Contributors

#### Component Testing Standards
- Test component rendering with different props
- Test user interactions (clicks, form submissions, keyboard events)
- Test error states and loading states
- Mock external dependencies (APIs, complex child components)
- Test accessibility attributes and keyboard navigation

#### API Testing Standards  
- Test successful response scenarios
- Test error scenarios (network errors, validation errors, server errors)
- Test edge cases (empty responses, malformed data)
- Mock external services (Ollama API calls)
- Test request/response data transformation

#### E2E Testing Standards
- Test complete user workflows from start to finish
- Test cross-browser compatibility 
- Test mobile responsiveness
- Test error recovery scenarios
- Use page object model for maintainable tests
- Mock external dependencies for consistent test environments

### Testing Anti-Patterns to Avoid

❌ **Don't do this:**
- Skip writing tests for "simple" components
- Test implementation details instead of behavior
- Write tests that are tightly coupled to specific code structure
- Commit code without running tests
- Mock everything (over-mocking)
- Write tests that don't actually test the functionality

✅ **Do this instead:**
- Test user-facing behavior and outcomes
- Focus on testing the public API/interface
- Write tests that would still pass if you refactored the implementation
- Run full test suite before committing
- Mock only external dependencies and complex integrations
- Test realistic user scenarios and edge cases

### Test Maintenance

#### When Tests Fail
1. **Never ignore failing tests** - they indicate problems
2. Understand why the test is failing before "fixing" it
3. Don't change tests to make them pass without understanding the impact
4. If behavior intentionally changed, update tests to reflect new expected behavior

#### Test Quality Standards
- Tests should be **readable** and **maintainable**
- Each test should test **one specific behavior**
- Tests should be **independent** and not rely on other tests
- Use descriptive test names that explain what is being tested
- Keep test setup minimal and focused

### Continuous Integration Requirements

All code changes must:
1. Pass TypeScript compilation (`npm run type-check`)
2. Pass ESLint validation (`npm run lint`)  
3. Pass all unit tests (`npm run test`)
4. Pass all E2E tests (`npm run test:e2e`)
5. Meet code coverage requirements (80%+)

### Testing Tools and Configuration

- **Jest**: Unit testing framework for both frontend and backend
- **React Testing Library**: Component testing utilities
- **Supertest**: HTTP assertion library for API testing
- **Playwright**: Cross-browser E2E testing framework
- **ESLint**: Code quality and style enforcement
- **TypeScript**: Type safety and compile-time error detection

Remember: **Quality is not negotiable**. Tests are not optional extras - they are a fundamental part of the codebase that ensure reliability, enable confident refactoring, and provide living documentation of how the system should behave.

## Commit Standards and Quality Gates

### Conventional Commits

This project enforces **Conventional Commits** through automated pre-commit hooks to ensure consistent commit history and enable automated tooling.

#### Required Format
```
type: description (max 100 characters)

[optional body]

[optional footer]
```

#### Allowed Commit Types
- **feat**: New feature for users
- **fix**: Bug fixes
- **docs**: Documentation changes
- **style**: Code formatting (no functionality change)
- **refactor**: Code restructuring without feature changes
- **test**: Adding or updating tests
- **build**: Build system or dependency changes
- **ci**: CI/CD configuration changes
- **chore**: Maintenance tasks
- **perf**: Performance improvements
- **revert**: Reverting previous commits

#### Examples
```bash
# Good examples
feat: adicionar template professor de espanhol
fix: corrigir validação de parâmetros de template
docs: atualizar README com configuração de portas
test: adicionar testes E2E para templates
build: atualizar dependências para versões mais recentes

# Bad examples (will be rejected)
update stuff                    # No type prefix
Fix: something                  # Wrong case
feat: add new feature...        # Too long (>100 chars)
```

### Pre-commit Quality Gates

Every commit automatically triggers quality checks via **Husky** and **lint-staged**:

#### Pre-commit Hook
- **ESLint**: Auto-fixes code style issues
- **TypeScript**: Validates type safety
- **Tests**: Runs relevant tests for modified files
- **Scope**: Only processes staged files for performance

#### Commit Message Hook  
- **Format validation**: Ensures conventional commit format
- **Type validation**: Checks allowed commit types
- **Length validation**: Enforces 100-character limit
- **Structure validation**: Validates required elements

### Development Workflow Integration

#### Before Every Commit
```bash
# Automatic (via pre-commit hook)
git add .
git commit -m "feat: your feature description"
# → Runs lint-staged automatically
# → Validates commit message format
# → Rejects if quality checks fail
```

#### Manual Quality Checks
```bash
npm run quality           # Full quality suite
npm run pre-commit       # Manual pre-commit checks
npm run validate-commit  # Validate last commit message
```

#### Quality Gate Requirements
All commits must:
1. ✅ Pass TypeScript compilation
2. ✅ Pass ESLint validation (auto-fixed when possible)
3. ✅ Pass relevant unit/E2E tests
4. ✅ Follow conventional commit message format
5. ✅ Stay within 100-character header limit

#### Bypassing Quality Gates
**Never bypass quality gates** in the main branch. If you must bypass locally during development:
```bash
git commit --no-verify -m "temp: work in progress"
```

**Important**: All bypassed commits must be cleaned up before merging to main.

### Benefits of This Approach

- **Consistent History**: All commits follow the same format
- **Automated Tooling**: Enables changelogs, versioning, and CI/CD automation
- **Quality Assurance**: Prevents broken code from entering the repository
- **Developer Experience**: Immediate feedback on code quality
- **Collaboration**: Clear expectations for all contributors

## Current Configuration

### Port Configuration
- **Development**:
  - Frontend: Port 4000 (`http://localhost:4000`)
  - Backend: Port 4001 (`http://localhost:4001`)
- **Docker**:
  - Frontend: Port 3000 (`http://localhost:3000`)
  - Backend: Port 3002 (`http://localhost:3002`)
- **Ollama**: Port 11434 (default, running locally)

### Docker Configuration
- Uses `host.docker.internal:11434` to connect to local Ollama instance
- Port mapping: `3000:3000` (frontend), `3002:3002` (backend)
- No Ollama container needed - uses existing local installation
- Environment variables:
  - `PORT=3002` (backend)
  - `FRONTEND_PORT=3000`
  - `OLLAMA_BASE_URL=http://host.docker.internal:11434`

### API Integration
- Backend connects directly to Ollama HTTP API endpoints:
  - `/api/tags` for model listing
  - `/api/generate` for chat completions
- No external dependencies like LlamaIndex
- Uses native Node.js `fetch()` for HTTP requests

Remember: The goal is to keep this project simple, maintainable, and focused on providing an excellent chat experience with Ollama.