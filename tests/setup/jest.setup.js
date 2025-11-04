// Jest setup file for DOM and custom matchers
import '@testing-library/jest-dom';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock fetch globally
global.fetch = jest.fn();

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});

// Custom matchers
expect.extend({
  toBeValidFeedback(received) {
    const hasRequiredFields =
      received.presentationId &&
      received.slideNumber !== undefined &&
      received.type &&
      received.description;

    const hasValidType = ['issue', 'suggestion'].includes(received.type);

    const pass = hasRequiredFields && hasValidType;

    return {
      pass,
      message: () =>
        pass
          ? `Expected ${JSON.stringify(received)} not to be valid feedback`
          : `Expected ${JSON.stringify(received)} to be valid feedback with required fields: presentationId, slideNumber, type, description`,
    };
  },
});
