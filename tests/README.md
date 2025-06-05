# Testing Guide for Vuetify Electron Starter

This directory contains comprehensive tests for the Vuetify Electron Starter application, including unit tests,
integration tests, and end-to-end tests.

## 🧪 Testing Framework Overview

- **Unit & Component Tests**: Vitest with Happy DOM environment
- **Integration Tests**: Vitest with filesystem mocking (memfs)
- **End-to-End Tests**: Cypress with Chrome browser
- **Coverage**: V8 coverage provider with HTML/JSON/text reports
- **Mocking**: In-memory filesystem for configuration testing

## 📁 Test Structure

```
tests/
├── setup.ts                          # Global test setup and utilities
├── unit/                             # Unit and component tests (Vitest)
│   ├── components/                   # Vue component tests
│   │   ├── example.spec.ts           # Basic unit test examples
│   │   └── component.spec.ts         # Vue component test examples
│   └── config/                       # Configuration unit tests
│       ├── config.spec.ts            # Configuration system tests
│       ├── browser-config.spec.ts    # Browser configuration tests
│       └── env-variable-coverage.spec.ts # Environment variable coverage
├── integration/                      # Integration tests (Vitest)
│   └── config_integration.spec.ts    # Configuration integration tests
├── e2e/                             # End-to-end tests (Cypress)
│   ├── fixtures/                    # Test data for E2E tests
│   │   └── example.json             # Sample test data
│   ├── support/                     # Support files for Cypress
│   │   └── component.js             # Component test configuration
│   ├── screenshots/                 # Test screenshots (auto-generated)
│   ├── videos/                      # Test videos (auto-generated)
│   └── home.cy.js                   # Sample E2E test for home page
├── fixtures/                        # Shared test fixtures
│   └── env_files.ts                 # Environment file fixtures
└── helpers/                         # Test helper utilities
    └── config_helpers.ts             # Configuration test helpers
```

## 🚀 Running Tests

### Unit and Integration Tests (Vitest)

Run all unit and integration tests:

```bash
npm run test
```

Run tests in watch mode (for development):

```bash
npm run test:watch
```

Generate test coverage report:

```bash
npm run test:coverage
```

### End-to-End Tests (Cypress)

Run all E2E tests headlessly:

```bash
npm run test:e2e
```

Open Cypress Test Runner (interactive mode):

```bash
npm run test:e2e:open
```

### Run All Tests

Run the complete test suite (unit + integration + e2e):

```bash
npm run test:all
```

### Continuous Integration

Run all checks (lint + type-check + tests):

```bash
npm run ci
```

## ✍️ Writing Tests

### Unit Tests

Unit tests are written using Vitest with a Happy DOM environment. See `tests/unit/components/example.spec.ts` for basic
examples.

```typescript
import {describe, it, expect} from 'vitest';

describe('Example Test Suite', () => {
  it('should pass a simple assertion', () => {
    expect(true).toBe(true);
  });

  it('should work with arrays', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });
});
```

### Component Tests

Component tests use Vitest with @vue/test-utils. See `tests/unit/components/component.spec.ts` for examples.

```typescript
import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';

const ExampleComponent = {
  template: `<div><h1>{{ title }}</h1></div>`,
  props: {title: {type: String, default: 'Example'}}
};

describe('ExampleComponent', () => {
  it('renders properly', () => {
    const wrapper = mount(ExampleComponent);
    expect(wrapper.find('h1').text()).toBe('Example');
  });

  it('renders with custom props', () => {
    const wrapper = mount(ExampleComponent, {
      props: {title: 'Custom Title'}
    });
    expect(wrapper.find('h1').text()).toBe('Custom Title');
  });
});
```

### Integration Tests

Integration tests use filesystem mocking with memfs. See `tests/integration/config_integration.spec.ts` for examples.

```typescript
import {describe, it, expect, beforeEach} from 'vitest';
import {vol} from 'memfs';
import {setupTestEnvironment} from '../helpers/config_helpers';

describe('Configuration Integration', () => {
  beforeEach(() => {
    vol.reset();
  });

  it('should load environment files', () => {
    setupTestEnvironment({
      nodeEnv: 'development',
      envFile: 'development'
    });

    expect(vol.existsSync('.env.development')).toBe(true);
  });
});
```

### E2E Tests

E2E tests use Cypress with the real browser. See `tests/e2e/home.cy.js` for examples.

```javascript
describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should have the correct title', () => {
    cy.title().should('include', 'Vuetify Electron Starter');
  });

  it('should display main navigation', () => {
    cy.get('[data-test="main-nav"]').should('be.visible');
  });
});
```

## 🔧 Test Configuration

### Vitest Configuration

Tests are configured in `vite.config.mts`

### Cypress Configuration

E2E tests are configured in `cypress.config.cjs`:

### Global Test Setup

The `tests/setup.ts` file provides:

- **In-memory filesystem**: Global memfs setup for all tests
- **Environment cleanup**: Automatic cleanup of environment variables
- **Console mocking**: Reduced noise in test output
- **Helper utilities**: Shared test utilities and fixtures

## 🛠️ Test Utilities

### Available Helpers

From `tests/setup.ts`:

```typescript
import {vol, createMockEnvFiles, setTestEnvVars, setupTestEnvironment} from './setup';

// Create mock files
createMockEnvFiles({
  '.env.development': 'VITE_PORT=3000\nVITE_HOST=localhost'
});

// Set environment variables
setTestEnvVars({NODE_ENV: 'test', DEBUG_BUILD: 'true'});

// Complete environment setup
setupTestEnvironment({
  envFiles: {'.env.test': 'VITE_PORT=3000'},
  envVars: {NODE_ENV: 'test'},
  nodeEnv: 'test'
});
```

From `tests/helpers/config_helpers.ts`:

```typescript
import {
  createDevEnvFile,
  createProdEnvFile,
  setupTestEnvironment
} from '../helpers/config_helpers';

// Create development environment
createDevEnvFile({VITE_PORT: '4000'});

// Create production environment
createProdEnvFile({VITE_USE_HTTPS: 'true'});

// Advanced environment setup
setupTestEnvironment({
  nodeEnv: 'production',
  envFile: 'production',
  customEnvVars: {DEBUG_BUILD: 'false'}
});
```

## 📋 Best Practices

### General Testing

1. **Test in isolation**: Each unit test should focus on a single unit of functionality
2. **Use descriptive test names**: Make it clear what each test is checking
3. **Mock external dependencies**: Use Vitest's mocking capabilities for API calls
4. **Use in-memory filesystem**: All file operations should use the global memfs setup
5. **Clean environment**: Tests automatically clean up environment variables

### Component Testing

1. **Test user interactions**: Focus on how users interact with components
2. **Test props and events**: Verify component inputs and outputs
3. **Use Vue Test Utils**: Leverage mounting, wrapper methods, and assertions
4. **Test accessibility**: Ensure components are accessible

### Integration Testing

1. **Test configuration loading**: Verify environment file loading and parsing
2. **Test environment-agnostic behavior**: Ensure code works across environments
3. **Use filesystem mocking**: Test file operations with memfs
4. **Test error scenarios**: Verify error handling and edge cases

### E2E Testing

1. **Test critical user flows**: Focus on main application workflows
2. **Use data attributes**: Add `data-test` attributes for stable selectors
3. **Test across viewports**: Ensure responsive behavior
4. **Keep tests focused**: Avoid testing every possible interaction

### Performance

1. **Run tests before committing**: Use `npm run ci` to verify all checks pass
2. **Use watch mode**: Use `npm run test:watch` during development
3. **Generate coverage**: Use `npm run test:coverage` to identify gaps
4. **Parallel execution**: Vitest runs tests in parallel by default

## 🐛 Debugging Tests

### Vitest Debugging

```bash
# Run specific test file
npx vitest tests/unit/config/config.spec.ts

# Run tests with verbose output
npx vitest --reporter=verbose

# Run tests in UI mode
npx vitest --ui
```

### Cypress Debugging

```bash
# Open Cypress with debugging
npm run test:e2e:open

# Run specific test file
npx cypress run --spec "tests/e2e/home.cy.js"

# Run with browser visible
npx cypress run --headed
```

### Common Issues

**❌ "Cannot find module" errors**

- Ensure imports use the correct paths relative to test files
- Check that `tests/setup.ts` is properly configured

**❌ Environment variable issues**

- Use `setupTestEnvironment()` helper for consistent setup
- Check that variables are cleaned between tests

**❌ Filesystem mocking issues**

- Ensure `vol.reset()` is called in `beforeEach`
- Use `vol.fromJSON()` to create mock files

**❌ Cypress connection issues**

- Ensure dev server is running on `http://localhost:3000`
- Check that `start-server-and-test` is properly configured
