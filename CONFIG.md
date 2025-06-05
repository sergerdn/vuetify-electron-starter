# Configuration Management

This project uses a type-safe configuration system with `dotenv` + `env-var` for environment variable management.

## Dynamic Environment Loading

The configuration system uses the pattern:

```typescript
// Check environment type from NODE_ENV (ONLY for file loading)
const env = process.env.NODE_ENV || 'development';
// Load the corresponding .env file
this.loadEnvFile(`.env.${env}`);
```

**Important**: `NODE_ENV` is ONLY used for loading the correct `.env` file. All application behavior is controlled
through configuration variables like `DEBUG_BUILD`, not environment checks.

## Configuration Class

### AppConfig

- **File**: `src/config/AppConfig.ts`
- **Usage**: Both Node.js (Electron main) and browser (renderer) processes
- **Features**: Full validation with `env-var`, type safety, dynamic environment loading

## Environment Files

Configuration is managed through exactly two environment-specific `.env` files:

- **`.env.development`** - Development settings (git-ignored)
- **`.env.production`** - Production settings (git-ignored)
- **`.env.example`** - Example template for development (committed to git)

### Environment Variables

```bash
# Development Server
VITE_PORT=3000
VITE_HOST=localhost
VITE_USE_HTTPS=false

# Application Window
VITE_WINDOW_WIDTH=1536
VITE_WINDOW_HEIGHT=864

# Application Info
VITE_APP_NAME=VuetifyElectronStarter
VITE_APP_VERSION=0.0.1
VITE_APP_AUTHOR=sergerdn

# Theme
VITE_DEFAULT_THEME=dark

# Development
VITE_OPEN_DEVTOOLS=true

# Debug (conditional logic)
DEBUG_BUILD=true

# Playwright with Fingerprints
# Note: On first launch, the engine will be downloaded to this folder (800+ MB, depends on internet speed)
PLAYWRIGHT_FINGERPRINTS_WORKING_FOLDER=.data_playwright_with_fingerprints
```

## Usage Examples

### Development (Default)

```bash
npm run dev
# Loads .env.development
```

### Production

```bash
NODE_ENV=production npm run dev
# Loads .env.production
```

### Custom Environment

```bash
NODE_ENV=staging npm run dev
# Loads .env.staging
```

### In Code

```typescript
import {appConfig} from '@/config';

// Use configuration
const theme = appConfig.theme.default; // 'dark'
const port = appConfig.server.port; // 3000
const serverUrl = appConfig.getServerUrl(); // http://localhost:3000

// Window configuration
const window = new BrowserWindow({
  width: appConfig.window.width,
  height: appConfig.window.height,
});
```

## Type Safety

The configuration classes provide full type safety:

```typescript
// ✅ Type-safe access
const port: number = appConfig.server.port;
const theme: 'light' | 'dark' = appConfig.theme.default;

// ❌ TypeScript will catch errors
const invalid = appConfig.server.invalidProperty; // Error!
```

## Validation

The `AppConfig` class automatically validates all environment variables:

- **Port numbers**: Must be between 1–65,535
- **Window dimensions**: Must be at least 100 px
- **Theme**: Must be 'light' or 'dark'
- **Required fields**: Cannot be empty

## Environment-Specific Configuration

### Development

```bash
NODE_ENV=development
VITE_OPEN_DEVTOOLS=true
```

### Production

```bash
NODE_ENV=production
VITE_OPEN_DEVTOOLS=false
```

## Customization

1. **Copy the example file**:
   ```bash
   copy .env.example .env.development
   ```

2. **Modify values in `.env.development`**:
   ```bash
   VITE_PORT=4000
   VITE_WINDOW_WIDTH=1600
   VITE_DEFAULT_THEME=light
   ```

3. **Configuration is automatically loaded** on application start

## Benefits

- ✅ **Type Safety**: Full TypeScript support
- ✅ **Validation**: Automatic validation with helpful error messages
- ✅ **Environment Separation**: Different configs for dev/prod
- ✅ **Centralized**: All configurations in one place
- ✅ **Hot Reload**: Changes to .env are picked up automatically
- ✅ **Documentation**: Self-documenting with TypeScript types
