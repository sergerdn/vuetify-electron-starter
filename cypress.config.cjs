/**
 * Cypress Configuration
 *
 * E2E testing configuration that integrates with our environment system
 */

const { defineConfig } = require('cypress');

// https://docs.cypress.io/app/references/configuration
// https://docs.cypress.io/app/component-testing/vue/overview
module.exports = defineConfig({
  e2e: {
    // Base URL for E2E tests
    baseUrl: 'http://localhost:3000',

    // Test files location
    specPattern: 'tests/e2e/**/*.cy.{js,jsx,ts,tsx}',

    // Fixtures location
    fixturesFolder: 'tests/e2e/fixtures',

    // Support a file (disabled for now)
    supportFile: false,

    // Screenshots and videos
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',

    // Viewport settings
    viewportWidth: 1536,
    viewportHeight: 864,

    // Test settings
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,

    // Video recording
    video: false,
    videoCompression: 32,

    // Screenshots
    screenshotOnRunFailure: true,

    // Browser settings
    chromeWebSecurity: false,

    // Environment variables for Cypress tests
    env: {
      // Static environment variables for testing
      APP_NAME: 'VuetifyElectronStarter',
      APP_VERSION: '0.0.1',
      DEFAULT_THEME: 'dark'
    },

    // noinspection JSUnusedGlobalSymbols
    setupNodeEvents(on, config) {
      // Node event listeners for Cypress

      // Log configuration on startup
      console.log('🔧 Cypress E2E Configuration:');
      console.log(`  Base URL: ${config.baseUrl}`);
      console.log(`  Viewport: ${config.viewportWidth}x${config.viewportHeight}`);

      // Task for logging
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });

      // Browser launch options
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome' || browser.name === 'edge') {
          // Add Chrome flags for better testing
          launchOptions.args.push('--disable-web-security');
          launchOptions.args.push('--disable-features=VizDisplayCompositor');
        }

        return launchOptions;
      });

      return config;
    }
  },

  component: {
    // Component testing configuration (if needed in the future)
    devServer: {
      framework: 'vue',
      bundler: 'vite'
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'tests/e2e/support/component.js'
  }
});
