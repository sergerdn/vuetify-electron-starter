/**
 * Test Fixtures for Environment Files
 *
 * Predefined environment file contents for testing
 */

export const ENV_FILE_FIXTURES = {
  development: {
    valid: `
VITE_PORT=3000
VITE_HOST=localhost
VITE_USE_HTTPS=false
VITE_WINDOW_WIDTH=1200
VITE_WINDOW_HEIGHT=800
VITE_APP_NAME=TestApp
VITE_APP_VERSION=1.0.0
VITE_APP_AUTHOR=TestAuthor
VITE_DEFAULT_THEME=dark
VITE_OPEN_DEVTOOLS=true
DEBUG_BUILD=true
    `.trim(),

    minimal: `
VITE_PORT=3000
VITE_HOST=localhost
    `.trim(),

    invalid_port: `
VITE_PORT=99999
VITE_HOST=localhost
    `.trim(),

    invalid_theme: `
VITE_PORT=3000
VITE_HOST=localhost
VITE_DEFAULT_THEME=invalid
    `.trim(),

    empty_app_name: `
VITE_PORT=3000
VITE_HOST=localhost
VITE_APP_NAME=
    `.trim()
  },

  production: {
    valid: `
VITE_PORT=443
VITE_HOST=example.com
VITE_USE_HTTPS=true
VITE_WINDOW_WIDTH=1024
VITE_WINDOW_HEIGHT=768
VITE_APP_NAME=ProdApp
VITE_APP_VERSION=1.0.0
VITE_APP_AUTHOR=ProdAuthor
VITE_DEFAULT_THEME=light
VITE_OPEN_DEVTOOLS=false
DEBUG_BUILD=false
    `.trim(),

    staging: `
VITE_PORT=8080
VITE_HOST=staging.example.com
VITE_USE_HTTPS=true
VITE_APP_NAME=StagingApp
VITE_DEFAULT_THEME=dark
VITE_OPEN_DEVTOOLS=true
DEBUG_BUILD=true
    `.trim()
  },

  custom: {
    high_res: `
VITE_PORT=4000
VITE_HOST=localhost
VITE_WINDOW_WIDTH=1920
VITE_WINDOW_HEIGHT=1080
VITE_DEFAULT_THEME=light
    `.trim(),

    api_focused: `
VITE_PORT=8080
VITE_HOST=api.localhost
VITE_USE_HTTPS=false
VITE_APP_NAME=APITestApp
DEBUG_BUILD=true
    `.trim()
  }
};

export const INVALID_ENV_FILES = {
  malformed_port: `
VITE_PORT=not_a_number
VITE_HOST=localhost
  `.trim(),

  negative_dimensions: `
VITE_PORT=3000
VITE_HOST=localhost
VITE_WINDOW_WIDTH=-100
VITE_WINDOW_HEIGHT=-100
  `.trim(),

  zero_dimensions: `
VITE_PORT=3000
VITE_HOST=localhost
VITE_WINDOW_WIDTH=0
VITE_WINDOW_HEIGHT=0
  `.trim(),

  missing_required: `
VITE_HOST=localhost
  `.trim()
};

export const EDGE_CASE_ENV_FILES = {
  whitespace_values: `
VITE_PORT=3000
VITE_HOST=  localhost  
VITE_APP_NAME=  Test App  
  `.trim(),

  boolean_variations: `
VITE_PORT=3000
VITE_HOST=localhost
VITE_USE_HTTPS=TRUE
VITE_OPEN_DEVTOOLS=False
DEBUG_BUILD=1
  `.trim(),

  empty_file: '',

  comments_and_empty_lines: `
# Development configuration
VITE_PORT=3000

# Server settings
VITE_HOST=localhost

# App settings
VITE_APP_NAME=TestApp
  `.trim()
};
