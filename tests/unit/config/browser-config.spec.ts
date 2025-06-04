/**
 * Browser Configuration Tests
 *
 * Tests the browser-compatible configuration (renderer process)
 * Uses environment variable mocking since browser config doesn't use filesystem
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BrowserConfig } from '../../../src/config';

describe('BrowserConfig', () => {
  beforeEach(() => {
    // Clear environment variables before each test
    delete process.env.VITE_PORT;
    delete process.env.VITE_HOST;
    delete process.env.VITE_USE_HTTPS;
    delete process.env.VITE_WINDOW_WIDTH;
    delete process.env.VITE_WINDOW_HEIGHT;
    delete process.env.VITE_APP_NAME;
    delete process.env.VITE_APP_VERSION;
    delete process.env.VITE_APP_AUTHOR;
    delete process.env.VITE_DEFAULT_THEME;
    delete process.env.VITE_OPEN_DEVTOOLS;
    delete process.env.DEBUG_BUILD;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Default Configuration', () => {
    it('should use default values when no environment variables are set', () => {
      const config = new BrowserConfig();

      expect(config.server.port).toBe(3000);
      expect(config.server.host).toBe('localhost');
      expect(config.server.useHttps).toBe(false);
      expect(config.window.width).toBe(1536);
      expect(config.window.height).toBe(864);
      expect(config.app.name).toBe('VuetifyElectronStarter');
      expect(config.app.version).toBe('0.0.1');
      expect(config.app.author).toBe('sergerdn');
      expect(config.theme.default).toBe('dark');
      expect(config.development.openDevTools).toBe(true);
      expect(config.debug.enabled).toBe(false);
    });
  });

  describe('Environment Variable Override', () => {
    it('should override server configuration from environment variables', () => {
      process.env.VITE_PORT = '8080';
      process.env.VITE_HOST = 'example.com';
      process.env.VITE_USE_HTTPS = 'true';

      const config = new BrowserConfig();

      expect(config.server.port).toBe(8080);
      expect(config.server.host).toBe('example.com');
      expect(config.server.useHttps).toBe(true);
    });

    it('should override window configuration from environment variables', () => {
      process.env.VITE_WINDOW_WIDTH = '1600';
      process.env.VITE_WINDOW_HEIGHT = '1000';

      const config = new BrowserConfig();

      expect(config.window.width).toBe(1600);
      expect(config.window.height).toBe(1000);
    });

    it('should override app configuration from environment variables', () => {
      process.env.VITE_APP_NAME = 'CustomApp';
      process.env.VITE_APP_VERSION = '2.0.0';
      process.env.VITE_APP_AUTHOR = 'CustomAuthor';

      const config = new BrowserConfig();

      expect(config.app.name).toBe('CustomApp');
      expect(config.app.version).toBe('2.0.0');
      expect(config.app.author).toBe('CustomAuthor');
    });

    it('should override theme configuration from environment variables', () => {
      process.env.VITE_DEFAULT_THEME = 'light';

      const config = new BrowserConfig();

      expect(config.theme.default).toBe('light');
    });

    it('should override development configuration from environment variables', () => {
      process.env.VITE_OPEN_DEVTOOLS = 'false';

      const config = new BrowserConfig();

      expect(config.development.openDevTools).toBe(false);
    });

    it('should override debug configuration from environment variables', () => {
      process.env.DEBUG_BUILD = 'true';

      const config = new BrowserConfig();

      expect(config.debug.enabled).toBe(true);
    });
  });

  describe('Type Validation', () => {
    it('should handle invalid port numbers gracefully', () => {
      process.env.VITE_PORT = 'invalid';

      expect(() => new BrowserConfig()).toThrow();
    });

    it('should handle invalid window dimensions gracefully', () => {
      process.env.VITE_WINDOW_WIDTH = 'invalid';

      expect(() => new BrowserConfig()).toThrow();
    });

    it('should handle invalid theme values gracefully', () => {
      process.env.VITE_DEFAULT_THEME = 'invalid';

      expect(() => new BrowserConfig()).toThrow();
    });

    it('should handle invalid boolean values gracefully', () => {
      process.env.VITE_USE_HTTPS = 'invalid';

      expect(() => new BrowserConfig()).toThrow();
    });
  });

  describe('URL Generation', () => {
    it('should generate HTTP URL by default', () => {
      const config = new BrowserConfig();
      expect(config.getServerUrl()).toBe('http://localhost:3000');
    });

    it('should generate HTTPS URL when configured', () => {
      process.env.VITE_PORT = '443';
      process.env.VITE_HOST = 'secure.example.com';
      process.env.VITE_USE_HTTPS = 'true';

      const config = new BrowserConfig();
      expect(config.getServerUrl()).toBe('https://secure.example.com:443');
    });

    it('should handle custom ports correctly', () => {
      process.env.VITE_PORT = '8443';
      process.env.VITE_HOST = 'api.example.com';
      process.env.VITE_USE_HTTPS = 'true';

      const config = new BrowserConfig();
      expect(config.getServerUrl()).toBe('https://api.example.com:8443');
    });
  });

  describe('Production vs Development Configuration', () => {
    it('should configure for development environment', () => {
      process.env.VITE_PORT = '3000';
      process.env.VITE_HOST = 'localhost';
      process.env.VITE_USE_HTTPS = 'false';
      process.env.VITE_DEFAULT_THEME = 'dark';
      process.env.VITE_OPEN_DEVTOOLS = 'true';
      process.env.DEBUG_BUILD = 'true';

      const config = new BrowserConfig();

      expect(config.server.port).toBe(3000);
      expect(config.server.host).toBe('localhost');
      expect(config.server.useHttps).toBe(false);
      expect(config.theme.default).toBe('dark');
      expect(config.development.openDevTools).toBe(true);
      expect(config.debug.enabled).toBe(true);
      expect(config.getServerUrl()).toBe('http://localhost:3000');
    });

    it('should configure for production environment', () => {
      process.env.VITE_PORT = '443';
      process.env.VITE_HOST = 'your-domain.com';
      process.env.VITE_USE_HTTPS = 'true';
      process.env.VITE_DEFAULT_THEME = 'light';
      process.env.VITE_OPEN_DEVTOOLS = 'false';
      process.env.DEBUG_BUILD = 'false';

      const config = new BrowserConfig();

      expect(config.server.port).toBe(443);
      expect(config.server.host).toBe('your-domain.com');
      expect(config.server.useHttps).toBe(true);
      expect(config.theme.default).toBe('light');
      expect(config.development.openDevTools).toBe(false);
      expect(config.debug.enabled).toBe(false);
      expect(config.getServerUrl()).toBe('https://your-domain.com:443');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string environment variables', () => {
      process.env.VITE_PORT = '';
      process.env.VITE_HOST = '';

      // Empty string for port should throw an error with env-var
      expect(() => new BrowserConfig()).toThrow();
    });

    it('should handle whitespace in environment variables', () => {
      process.env.VITE_APP_NAME = '  TestApp  ';

      const config = new BrowserConfig();

      expect(config.app.name).toBe('  TestApp  '); // env-var preserves whitespace
    });

    it('should handle zero values correctly', () => {
      process.env.VITE_WINDOW_WIDTH = '0';

      // Zero should be accepted by env-var but our validation should catch it
      const config = new BrowserConfig();
      expect(config.window.width).toBe(0); // env-var allows 0, but it's not ideal
    });

    it('should handle negative port numbers', () => {
      process.env.VITE_PORT = '-1';

      expect(() => new BrowserConfig()).toThrow();
    });

    it('should handle port numbers above valid range', () => {
      process.env.VITE_PORT = '99999';

      expect(() => new BrowserConfig()).toThrow();
    });

    it('should handle negative window dimensions', () => {
      process.env.VITE_WINDOW_WIDTH = '-100';

      expect(() => new BrowserConfig()).toThrow();
    });

    it('should handle boolean-like strings correctly', () => {
      process.env.VITE_USE_HTTPS = 'TRUE';
      process.env.VITE_OPEN_DEVTOOLS = 'False';
      process.env.DEBUG_BUILD = '1';

      const config = new BrowserConfig();

      expect(config.server.useHttps).toBe(true);
      expect(config.development.openDevTools).toBe(false);
      expect(config.debug.enabled).toBe(true);
    });

    it('should handle empty app name', () => {
      process.env.VITE_APP_NAME = '';

      const config = new BrowserConfig();

      expect(config.app.name).toBe('');
    });
  });
});
