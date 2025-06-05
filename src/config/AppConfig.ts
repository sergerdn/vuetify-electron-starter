/**
 * Application Configuration Class
 *
 * Type-safe configuration management using dotenv + env-var
 * This class provides validated environment variables with proper types
 *
 * Environment Loading Logic:
 * - Development: Loads .env.development (default)
 * - Production: Loads .env.production (when NODE_ENV=production)
 * - Custom: Loads .env.{NODE_ENV} for any environment
 */

import { config } from 'dotenv';
import env from 'env-var';
import path from 'path';
import fs from 'fs';

export class AppConfig {
  constructor() {
    this.loadEnvironmentFiles();
  }

  /**
   * Load environment files based on NODE_ENV
   */
  private loadEnvironmentFiles(): void {
    // Check an environment type from NODE_ENV (ONLY for file loading)
    const env = process.env.NODE_ENV || 'development';

    console.log(`🔧 Loading configuration for environment: ${env}`);

    // Load environment-specific .env file (.env.development or .env.production)
    this.loadEnvFile(`.env.${env}`);

    console.log(`✅ Environment files loaded for: ${env}`);
  }

  /**
   * Load a specific .env file if it exists
   */
  private loadEnvFile(filename: string): void {
    const filePath = path.resolve(process.cwd(), filename);

    if (fs.existsSync(filePath)) {
      const result = config({ path: filePath });
      console.log(`📄 Loaded: ${filename}`);

      if (result.error) {
        console.warn(`⚠️  Warning loading ${filename}:`, result.error.message);
      }
    } else {
      console.log(`📄 Skipped: ${filename} (not found)`);
    }
  }

  // Development Server Configuration
  public readonly server = {
    port: env.get('VITE_PORT').default('3000').asPortNumber(),
    host: env.get('VITE_HOST').default('localhost').asString(),
    useHttps: env.get('VITE_USE_HTTPS').default('false').asBool()
  };

  // Application Window Configuration
  public readonly window = {
    width: env.get('VITE_WINDOW_WIDTH').default('1536').asIntPositive(),
    height: env.get('VITE_WINDOW_HEIGHT').default('864').asIntPositive()
  };

  // Application Information
  public readonly app = {
    name: env.get('VITE_APP_NAME').default('VuetifyElectronStarter').asString(),
    version: env.get('VITE_APP_VERSION').default('0.0.1').asString(),
    author: env.get('VITE_APP_AUTHOR').default('sergerdn').asString()
  };

  // UI Theme Configuration
  public readonly theme = {
    default: env.get('VITE_DEFAULT_THEME').default('dark').asEnum(['light', 'dark'])
  };

  // Development Configuration
  public readonly development = {
    openDevTools: env.get('VITE_OPEN_DEVTOOLS').default('true').asBool()
  };

  // Debug Configuration (only when conditional logic is needed)
  public readonly debug = {
    enabled: env.get('DEBUG_BUILD').default('false').asBool()
  };

  // Playwright with Fingerprints Configuration
  public readonly playwrightFingerprints = {
    workingFolder: env.get('PLAYWRIGHT_FINGERPRINTS_WORKING_FOLDER').default('.data_playwright_with_fingerprints').asString()
  };

  /**
   * Get the server URL (HTTP/HTTPS based on configuration)
   */
  public getServerUrl(): string {
    const protocol = this.server.useHttps ? 'https' : 'http';
    return `${protocol}://${this.server.host}:${this.server.port}`;
  }

  /**
   * Validate all configuration values
   * Throws an error if any required configuration is invalid
   */
  public validate(): void {
    try {
      // Validate server configuration
      if (this.server.port < 1 || this.server.port > 65535) {
        throw new Error('VITE_PORT must be between 1 and 65535');
      }

      // Validate window configuration
      if (this.window.width < 100) {
        throw new Error('VITE_WINDOW_WIDTH must be at least 100');
      }

      if (this.window.height < 100) {
        throw new Error('VITE_WINDOW_HEIGHT must be at least 100');
      }

      // Validate app information
      if (!this.app.name.trim()) {
        throw new Error('VITE_APP_NAME cannot be empty');
      }

      console.log('✅ Configuration validation passed');
    } catch (error) {
      console.error('❌ Configuration validation failed:', error);
      throw error;
    }
  }

  /**
   * Log the current configuration (only when debug is enabled)
   */
  public logConfig(): void {
    // Only log if the debug build is enabled (conditional logic)
    if (this.debug.enabled) {
      console.log('📊 Current Configuration:');
      console.log(`  Server: ${this.getServerUrl()}`);
      console.log(`  Window: ${this.window.width}x${this.window.height}`);
      console.log(`  Theme: ${this.theme.default}`);
      console.log(`  DevTools: ${this.development.openDevTools}`);
    }
  }

  /**
   * Get configuration as a plain object (useful for serialization)
   */
  public toObject() {
    return {
      server: this.server,
      window: this.window,
      app: this.app,
      theme: this.theme,
      development: this.development,
      debug: this.debug,
      playwrightFingerprints: this.playwrightFingerprints
    };
  }
}

// Create and export a singleton instance
export const appConfig = new AppConfig();

// Validate configuration on import
appConfig.validate();

// Log configuration in development
appConfig.logConfig();

export default appConfig;
