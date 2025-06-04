/**
 * Configuration Test Helpers
 *
 * Utilities for testing configuration functionality
 */

import { vol } from 'memfs';

/**
 * Create mock environment files for testing
 */
export function createMockEnvFiles(files: Record<string, string>) {
  vol.fromJSON(files);
}

/**
 * Create a development environment file
 */
export function createDevEnvFile(overrides: Record<string, string> = {}) {
  const defaultDevConfig = {
    VITE_PORT: '3000',
    VITE_HOST: 'localhost',
    VITE_USE_HTTPS: 'false',
    VITE_WINDOW_WIDTH: '1200',
    VITE_WINDOW_HEIGHT: '800',
    VITE_APP_NAME: 'VuetifyElectronStarter',
    VITE_APP_VERSION: '0.0.1',
    VITE_APP_AUTHOR: 'sergerdn',
    VITE_DEFAULT_THEME: 'dark',
    VITE_OPEN_DEVTOOLS: 'true',
    DEBUG_BUILD: 'true',
    ...overrides
  };

  const envContent = Object.entries(defaultDevConfig)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  createMockEnvFiles({
    '.env.development': envContent
  });
}

/**
 * Create a production environment file
 */
export function createProdEnvFile(overrides: Record<string, string> = {}) {
  const defaultProdConfig = {
    VITE_PORT: '443',
    VITE_HOST: 'your-domain.com',
    VITE_USE_HTTPS: 'true',
    VITE_WINDOW_WIDTH: '1024',
    VITE_WINDOW_HEIGHT: '768',
    VITE_APP_NAME: 'VuetifyElectronStarter',
    VITE_APP_VERSION: '0.0.1',
    VITE_APP_AUTHOR: 'sergerdn',
    VITE_DEFAULT_THEME: 'light',
    VITE_OPEN_DEVTOOLS: 'false',
    DEBUG_BUILD: 'false',
    ...overrides
  };

  const envContent = Object.entries(defaultProdConfig)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  createMockEnvFiles({
    '.env.production': envContent
  });
}

/**
 * Set environment variables for testing
 */
export function setTestEnvVars(vars: Record<string, string>) {
  Object.entries(vars).forEach(([key, value]) => {
    process.env[key] = value;
  });
}

/**
 * Clear test environment variables
 */
export function clearTestEnvVars() {
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
}

/**
 * Set up a complete test environment
 */
export function setupTestEnvironment(options: {
  nodeEnv?: 'development' | 'production' | 'test' | 'staging';
  envFile?: 'development' | 'production' | 'custom';
  customEnvVars?: Record<string, string>;
  customEnvFile?: Record<string, string>;
}) {
  const { nodeEnv = 'test', envFile, customEnvVars = {}, customEnvFile = {} } = options;

  // Clear existing environment
  clearTestEnvVars();

  // Set NODE_ENV
  process.env.NODE_ENV = nodeEnv;

  // Create an environment file
  if (envFile === 'development') {
    createDevEnvFile();
  } else if (envFile === 'production') {
    createProdEnvFile();
  } else if (envFile === 'custom') {
    createMockEnvFiles({
      [`.env.${nodeEnv}`]: Object.entries(customEnvFile)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n')
    });
  }

  // Set additional environment variables
  if (Object.keys(customEnvVars).length > 0) {
    setTestEnvVars(customEnvVars);
  }
}
