/**
 * Global Test Setup
 *
 * Sets up a global test environment including in-memory filesystem
 * and common test utilities
 */

import { beforeEach, afterEach, vi } from 'vitest';
import { vol } from 'memfs';

// Global setup for in-memory filesystem
beforeEach(() => {
  // Reset the virtual filesystem before each test
  vol.reset();

  // Clear all environment variables that might affect tests
  const envVarsToClean = [
    'NODE_ENV',
    'VITE_PORT',
    'VITE_HOST',
    'VITE_USE_HTTPS',
    'VITE_WINDOW_WIDTH',
    'VITE_WINDOW_HEIGHT',
    'VITE_APP_NAME',
    'VITE_APP_VERSION',
    'VITE_APP_AUTHOR',
    'VITE_DEFAULT_THEME',
    'VITE_OPEN_DEVTOOLS',
    'DEBUG_BUILD'
  ];

  envVarsToClean.forEach(envVar => {
    delete process.env[envVar];
  });
});

afterEach(() => {
  // Clear all mocks after each test
  vi.clearAllMocks();

  // Reset the virtual filesystem
  vol.reset();
});

// Global mock for filesystem operations
vi.mock('fs', () => ({
  // @ts-expect-error TS property 'fs' does not exist
  default: vi.importActual('memfs').fs,
  // @ts-expect-error TS property 'fs' does not exist
  ...vi.importActual('memfs').fs
}));

vi.mock('fs/promises', () => ({
  // @ts-expect-error TS property 'fs' does not exist
  default: vi.importActual('memfs').fs.promises,
  // @ts-expect-error TS property 'fs' does not exist
  ...vi.importActual('memfs').fs.promises
}));

// Global mock for path operations (Windows/Unix compatible)
vi.mock('path', () => ({
  default: {
    resolve: (...args: string[]) => args.join('/').replace(/\/+/g, '/'),
    join: (...args: string[]) => args.join('/').replace(/\/+/g, '/'),
    dirname: (path: string) => path.split('/').slice(0, -1).join('/') || '/',
    basename: (path: string) => path.split('/').pop() || '',
    extname: (path: string) => {
      const name = path.split('/').pop() || '';
      const lastDot = name.lastIndexOf('.');
      return lastDot > 0 ? name.slice(lastDot) : '';
    }
  },
  resolve: (...args: string[]) => args.join('/').replace(/\/+/g, '/'),
  join: (...args: string[]) => args.join('/').replace(/\/+/g, '/'),
  dirname: (path: string) => path.split('/').slice(0, -1).join('/') || '/',
  basename: (path: string) => path.split('/').pop() || '',
  extname: (path: string) => {
    const name = path.split('/').pop() || '';
    const lastDot = name.lastIndexOf('.');
    return lastDot > 0 ? name.slice(lastDot) : '';
  }
}));

// Global console mock to reduce noise in tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  // Mock console methods to avoid noise in the test output
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  // Restore console methods
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Export utilities for tests
export { vol } from 'memfs';

/**
 * Helper function to create mock environment files
 */
export function createMockEnvFiles(files: Record<string, string>) {
  vol.fromJSON(files);
}

/**
 * Helper function to set environment variables for tests
 */
export function setTestEnvVars(vars: Record<string, string>) {
  Object.entries(vars).forEach(([key, value]) => {
    process.env[key] = value;
  });
}

/**
 * Helper function to create a complete test environment
 */
export function setupTestEnvironment(options: {
  envFiles?: Record<string, string>;
  envVars?: Record<string, string>;
  nodeEnv?: string;
}) {
  const { envFiles = {}, envVars = {}, nodeEnv = 'test' } = options;

  // Set NODE_ENV
  process.env.NODE_ENV = nodeEnv;

  // Create mock files
  if (Object.keys(envFiles).length > 0) {
    createMockEnvFiles(envFiles);
  }

  // Set environment variables
  if (Object.keys(envVars).length > 0) {
    setTestEnvVars(envVars);
  }
}
