# Vuetify Electron Starter

A modern starter template for building Windows desktop applications with Vue.js 3, Vuetify 3, and Electron. This
template combines the power of modern web technologies with native Windows desktop capabilities.

## ✨ Features

### 🖥️ Desktop Application

- **Electron 36.3.2** Latest stable version for Windows desktop apps
- **electron-vite 3.1.0** Modern build tooling for Electron
- **electron-builder 26.0.12** Complete solution to package and build Electron apps
- **OS Integration** IPC communication between renderer and main process
- **External Browser Control** Open URLs in Chrome or default browser
- **Native Notifications** System-level notification support
- **System Information API** Access to platform and version details

### 🚀 Modern Web Stack

- **Vue.js 3** Progressive JavaScript framework with Composition API
- **Vuetify 3** Material Design component framework
- **Vite 6.3.5** Next generation frontend tooling
- **TypeScript** Full TypeScript support throughout the project
- **Pinia** - Intuitive state management for Vue

### 🧪 Testing & Quality

- **Vitest** Fast unit testing framework
- **Cypress** End-to-end testing framework
- **ESLint** Code linting and formatting
- **Auto-imports** - Automatic imports for Vue and utilities

### 🔧 Development Experience

- **Hot Module Replacement** - Instant updates during development
- **DevTools Integration** - Built-in debugging capabilities
- **Modern Security** Context isolation and secure preload scripts
- **Auto-updater Ready** - Built-in support for application updates (optional)
- **Icon Integration** - Automatic Windows icon support with a build process

## Prerequisites

- [Node.js](https://nodejs.org/) (v22 or higher)
- npm

## Installation

```bash
git clone https://github.com/sergerdn/vuetify-electron-starter.git
cd vuetify-electron-starter
npm install
```

## 🚀 Quick Start

### Web Development

Start the web development server:

```bash
npm run dev
```

This will start the Vite development server at `http://localhost:3000` with hot module replacement.

### Electron Development

Start the Electron application in development mode:

```bash
npm run electron:dev
```

This will:

- Build the main and preload processes
- Start the Vite development server
- Launch the Electron application with DevTools enabled
- Enable hot reload for both the renderer and main processes

### Building for Production

#### Web Build

Build the web application for production:

```bash
npm run build
```

#### Electron Build

Build the complete Electron application:

```bash
npm run electron:build
```

This will:

- Build the renderer process (Vue.js app)
- Build the main and preload processes
- Package the application using electron-builder
- Create platform-specific installers and executables

**Output:**

- `dist-electron/win-unpacked/` - Unpacked Windows application folder
- `dist-electron/win-unpacked/Vuetify Electron Starter.exe` - Windows executable with custom icon

### Preview Built Application

Preview the built Electron application:

```bash
npm run electron:preview
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

## 📁 Project Structure

```
├── public/                     # Static assets
├── src/                        # Source code
│   ├── electron-main/          # Electron main process (Windows-focused)
│   │   └── index.ts           # Main process entry point
│   ├── electron-preload/       # Electron preload scripts
│   │   ├── index.ts           # Preload script
│   │   └── types.d.ts         # TypeScript definitions
│   ├── components/            # Vue components
│   ├── layouts/               # Page layouts
│   ├── pages/                 # Application pages
│   ├── plugins/               # Vue plugins
│   ├── router/                # Vue Router configuration
│   └── stores/                # Pinia stores
├── tests/                     # Test files
│   ├── e2e/                   # End-to-end tests (Cypress)
│   └── unit/                  # Unit tests (Vitest)
├── build-electron/            # Compiled Electron files
│   ├── electron-main/         # Compiled main process
│   ├── electron-preload/      # Compiled preload scripts
│   └── renderer/              # Compiled renderer (Vue app)
├── dist-electron/             # Built Windows application
├── build-resources/           # Build assets (icons, etc.)
├── electron.vite.config.ts    # Electron-Vite configuration
├── vite.config.ts             # Vite configuration
└── package.json               # Dependencies and scripts
```

## 🔧 Configuration Files

### Electron Configuration

- **`electron.vite.config.ts`** - Main configuration for electron-vite build tool
- **`src/electron-main/index.ts`** - Electron main process with Windows-focused functionality
- **`src/electron-preload/index.ts`** - Secure preload script for renderer communication

### Build Configuration

- **`vite.config.ts`** - Vite configuration for the renderer process
- **`package.json`** - Contains electron-builder configuration and scripts

## 📋 Available Scripts

| Script                     | Description                                |
|----------------------------|--------------------------------------------|
| `npm run dev`              | Start web development server               |
| `npm run build`            | Build web application for production       |
| `npm run preview`          | Preview built web application              |
| `npm run electron:dev`     | Start Electron in development mode         |
| `npm run electron:build`   | Build complete Electron application        |
| `npm run electron:preview` | Preview built Electron application         |
| `npm run test`             | Run unit tests with Vitest                 |
| `npm run test:e2e`         | Run end-to-end tests with Cypress          |
| `npm run test:e2e:open`    | Open Cypress test runner                   |
| `npm run test:all`         | Run all tests (unit + e2e)                 |
| `npm run lint`             | Lint code with ESLint                      |
| `npm run type-check`       | Check TypeScript types                     |
| `npm run ci`               | Run all checks (lint + type-check + tests) |

## 🛠️ Development Tips

### Debugging Electron

- **Main Process**: Use `console.log()` statements - output appears in the terminal
- **Renderer Process**: Use browser DevTools (automatically opened in development)
- **Preload Script**: Use `console.log()` - output appears in DevTools console
- **Router Debug**: Check `console` for "🔧 Router Configuration Debug" to verify history mode

### Hot Reload

- **Renderer Process**: Automatic hot reload via Vite
- **Main/Preload Process**: Automatic restart when files change

### Windows-Only Configuration

This project is configured specifically for Windows development:

```json
{
  "build": {
    "win": {
      "target": [
        {
          "target": "dir",
          "arch": [
            "x64"
          ]
        }
      ],
      "icon": "build-resources/v-logo.ico",
      "artifactName": "${productName}-${version}-${arch}"
    }
  }
}
```

### Customizing Application Icon

The application includes automatic icon integration:

1. **Replace the icon**: Add your custom `icon.ico` file to `build-resources/` (currently using `v-logo.ico`)
2. **Build the app**: Run `npm run electron:build`
3. **Verify**: Check the executable in `dist-electron/win-unpacked/`

For detailed icon requirements and creation guides, see [build-resources/README.md](./build-resources/README.md).

### Security Best Practices

This template follows Electron security best practices:

- ✅ Context isolation enabled
- ✅ Node integration disabled in renderer
- ✅ Secure preload scripts
- ✅ Content Security Policy ready

## ⚠️ Important Electron Considerations

### File Protocol & Routing

Electron applications run using the `file://` protocol, which has important implications:

**🔧 Router Configuration:**

- **Development**: Uses `createWebHistory` (works with Vite dev server)
- **Production**: Automatically switches to `createWebHashHistory` for `file://` compatibility
- **URLs**: Production URLs will have a hash format: `file:///path/to/app/index.html#/route`

**📁 File Protocol Limitations:**

- HTML5 History API doesn't work with `file://` protocol
- CORS restrictions apply to local file access
- Some web APIs may behave differently

### Font Loading & Preloading

**🚫 Font Preload Considerations:**

- Font preload links work correctly with proper MIME types
- No `crossorigin` issues with local file system access
- Fonts load efficiently in Electron environment

**⚡ Performance Notes:**

- Optimized font loading for Electron's local file system
- No console warnings about preload resources
- Efficient asset loading with proper caching

### Development vs. Production

**Key Differences:**

- **Development**: Runs against Vite dev server (`http://localhost:3000`)
- **Production**: Loads from local files (`file://` protocol)
- **Router**: Automatically adapts history mode based on the environment
- **DevTools**: Available in development, disabled in production builds

## 🔧 Troubleshooting

### Black Screen in Production

If you see a black screen when running the built Electron app:

1. **Check Router History Mode**: Ensure hash history is being used for `file://` protocol
2. **Verify File Paths**: Check that all assets are loading correctly
3. **Console Errors**: Open DevTools in development to check for JavaScript errors
4. **Font Loading**: Ensure font preload links are properly configured

### Common Issues

**❌ "Failed to fetch dynamically imported module"**

- **Cause**: Network issues or incorrect base URL
- **Solution**: The router includes automatic retry logic for this issue

**❌ Font preload warnings**

- **Cause**: Invalid MIME types or CORS issues with `file://` protocol
- **Solution**: Router hash history resolves most compatibility issues

**❌ Routing not working**

- **Cause**: HTML5 History API incompatible with `file://` protocol
- **Solution**: Hash history automatically enabled in production builds

### Getting Help

1. Check the console for error messages
2. Verify that development mode works (`npm run electron:dev`)
3. Compare behavior between web and Electron versions
4. Review the Electron security documentation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m 'feat: add amazing feature'
   git commit -m 'fix: resolve issue with component'
   git commit -m 'docs: update README with new instructions'
   ```
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Format

This project follows [the Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

**Examples:**

```bash
feat(electron): add auto-updater functionality
fix(renderer): resolve routing issue in production
docs(readme): add installation instructions
chore(deps): update electron to latest version
```

## License

[MIT](http://opensource.org/licenses/MIT) licensed.
