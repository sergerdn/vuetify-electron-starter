# Vuetify Electron Starter

A starter template for building desktop applications with Vue.js, Vuetify, and Electron.

This template is designed to be extended for desktop applications with Electron.

## Features

- Vue.js 3 and Vuetify 3
- Electron for cross-platform desktop apps
- Pinia for state management
- TypeScript support
- Vite build system
- Comprehensive testing setup with Vitest and Cypress

## Prerequisites

- [Node.js](https://nodejs.org/) (v22 or higher)
- npm

## Installation

```bash
git clone https://github.com/sergerdn/vuetify-electron-starter.git
cd vuetify-electron-starter
npm install
```

## Usage

### Development

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Electron Development

```bash
npm run electron:dev
```

### Electron Build

```bash
npm run electron:build
```

### Testing

Run unit tests:

```bash
npm run test
```

Run E2E tests:

```bash
npm run test:e2e
```

## Project Structure

```
├── public/             # Static assets
├── src/                # Source code
│   ├── components/     # Vue components
│   ├── layouts/        # Page layouts
│   ├── pages/          # Application pages
│   ├── plugins/        # Vue plugins
│   ├── router/         # Vue Router configuration
│   └── stores/         # Pinia stores
└── tests/              # Test files
    ├── e2e/            # End-to-end tests (Cypress)
    └── unit/           # Unit tests (Vitest)
```

## License

[MIT](http://opensource.org/licenses/MIT) licensed.
