import vuetify from 'eslint-config-vuetify';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import vuePlugin from 'eslint-plugin-vue';

export default [
  // Global ignores (MUST be the first and separate object with ONLY ignores property)
  // Note: In flat config, patterns need **/ prefix for recursive matching
  // Example: "**/dist/**" ignores any 'dist' folder at any depth
  //          "dist/**" only ignores 'dist' folder in the project root
  {
    ignores: [
      // Build output directories (generated files, not source code)
      '**/dist/**', // Vite build output
      '**/build/**', // General build output
      '**/build-electron/**', // Electron build output
      '**/dist-electron/**', // Electron distribution files
      '**/dist-resources/**', // Electron resources
      '**/coverage/**', // Test coverage reports

      // Dependencies (third-party code)
      '**/node_modules/**', // npm/yarn dependencies

      // IDE and editor files (not part of source code)
      '**/.idea/**', // JetBrains IDEs (WebStorm, IntelliJ)
      '**/.vscode/**', // Visual Studio Code settings

      // Auto-generated files (created by Vue/Vite tooling)
      '**/src/auto-imports.d.ts', // Auto-import declarations
      '**/src/components.d.ts', // Component type declarations
      '**/src/typed-router.d.ts', // Router type declarations

      // Test and report directories
      '**/playwright-report/**', // Playwright test reports
      '**/test-results/**', // Test result files
      '**/storybook_static/**', // Storybook build output
      '**/tests/e2e/videos/**', // Cypress/E2E test videos
      '**/tests/e2e/screenshots/**', // Cypress/E2E test screenshots

      // Log files and temporary files
      '**/*.log', // All log files anywhere
      '**/.DS_Store', // macOS system files
      '**/Thumbs.db', // Windows system files
      '**/*.tmp', // Temporary files
      '**/*.temp', // Temporary files

      // Version control and cache
      '**/.git/**', // Git repository files
      '**/.cache/**', // Cache directories

      // Data directories (runtime data, not source code)
      '**/.data*/**', // Any folder starting with .data (e.g., .data_playwright_with_fingerprints)

      // Package manager files (lock files are generated)
      '**/package-lock.json', // npm lock file
      '**/yarn.lock', // Yarn lock file
      '**/pnpm-lock.yaml', // pnpm lock file

      // Minified and bundled files (processed code)
      '**/*.min.js', // Minified JavaScript
      '**/*.bundle.js', // Bundled JavaScript
      '**/assets/**' // Built assets (CSS, JS, images)
    ]
  },
  // Main configuration
  {
    ...vuetify(),
    ...eslintConfigPrettier,
    plugins: {
      prettier: prettierPlugin,
      vue: vuePlugin
    },
    rules: {
      'prettier/prettier': 'error',
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always'
          }
        }
      ],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/multi-word-component-names': 'off'
    }
  }
];
