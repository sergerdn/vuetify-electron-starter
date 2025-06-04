/**
 * Configuration Module Entry Point
 *
 * Exports browser-compatible configuration
 */

import env from 'env-var';

// Browser-compatible configuration (no Node.js modules)
export class BrowserConfig {
  // Development Server Configuration
  public readonly server = {
    port: env.get('VITE_PORT').default('3000').asPortNumber(),
    host: env.get('VITE_HOST').default('localhost').asString(),
    useHttps: env.get('VITE_USE_HTTPS').default('false').asBool()
  };

  // Application Window Configuration
  public readonly window = {
    width: env.get('VITE_WINDOW_WIDTH').default('1200').asIntPositive(),
    height: env.get('VITE_WINDOW_HEIGHT').default('800').asIntPositive()
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

  /**
   * Get the server URL (HTTP/HTTPS based on configuration)
   */
  public getServerUrl(): string {
    const protocol = this.server.useHttps ? 'https' : 'http';
    return `${protocol}://${this.server.host}:${this.server.port}`;
  }
}

// Create and export a singleton instance
export const appConfig = new BrowserConfig();

// Export as default
export default appConfig;
