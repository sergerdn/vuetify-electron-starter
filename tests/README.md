# Testing Guide for Vuetify Electron Starter

This directory contains tests for the Vuetify Electron Starter application.

The testing setup includes both unit/component tests with Vitest and end-to-end tests with Cypress.

## Test Structure

```
tests/
├── unit/                  # Unit and component tests with Vitest
│   ├── example.spec.ts    # Basic unit test examples
│   └── component.spec.ts  # Vue component test examples
└── e2e/                   # End-to-end tests with Cypress
    ├── fixtures/          # Test data for E2E tests
    │   └── example.json   # Sample test data
    ├── support/           # Support files for Cypress
    │   ├── e2e.js         # E2E test configuration
    │   └── component.js   # Component test configuration
    └── home.cy.js         # Sample E2E test for home page
```

## Running Tests

### Unit and Component Tests (Vitest)

Run all unit tests at once:

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

## Writing Tests

### Unit Tests

Unit tests are written using Vitest. See `tests/unit/example.spec.ts` for basic examples.

```typescript
import {describe, it, expect} from 'vitest';

describe('Example Test Suite', () => {
  it('should pass a simple assertion', () => {
    expect(true).toBe(true);
  });
});
```

### Component Tests

Component tests use Vitest with @vue/test-utils. See `tests/unit/component.spec.ts` for examples.

```typescript
import {mount} from '@vue/test-utils';
import {describe, it, expect} from 'vitest';
import YourComponent from '@/components/YourComponent.vue';

describe('YourComponent', () => {
  it('renders properly', () => {
    const wrapper = mount(YourComponent);
    expect(wrapper.text()).toContain('Expected text');
  });
});
```

### E2E Tests

E2E tests use Cypress. See `tests/e2e/home.cy.js` for examples.

```javascript
describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should have the correct title', () => {
    cy.title().should('include', 'Vuetify Electron Starter');
  });
});
```

## Best Practices

1. **Test in isolation**: Each unit test should focus on a single unit of functionality
2. **Use descriptive test names**: Make it clear what each test is checking
3. **Mock external dependencies**: Use Vitest's mocking capabilities for API calls
4. **Keep E2E tests focused**: Test critical user flows rather than every possible interaction
5. **Use data attributes for selectors**: Add `data-test` attributes to elements for more stable E2E tests
6. **Run tests before committing**: Make sure all tests pass before pushing changes
