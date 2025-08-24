// Setup file for Jest tests
// This file is executed before each test file

// Global test setup
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.PORT = '5001';
  process.env.OLLAMA_BASE_URL = 'http://localhost:11434';
  process.env.DEFAULT_MODEL = 'llama2';
});

// Global test teardown
afterAll(() => {
  // Clean up any global resources if needed
});

// Suppress console logs in tests unless explicitly needed
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  // Uncomment to suppress logs during tests
  // log: jest.fn(),
  // error: jest.fn(),
  // warn: jest.fn(),
  // info: jest.fn(),
  // debug: jest.fn(),
};