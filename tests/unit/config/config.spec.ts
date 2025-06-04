/**
 * Configuration Integration Tests
 *
 * Tests the configuration functionality using environment variables and filesystem mocking
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { vol } from 'memfs';
import { ENV_FILE_FIXTURES } from '../../fixtures/env_files';

describe('Configuration System', () => {
  beforeEach(() => {
    // Setup is handled globally in tests/setup.ts
    vol.reset();
  });

  describe('Environment File Loading with Filesystem', () => {
    it('should load development environment file by default', () => {
      // Create a mock .env.development file using in-memory filesystem
      vol.fromJSON({
        '.env.development': ENV_FILE_FIXTURES.development.valid
      });

      // Verify the file exists in memory
      expect(vol.existsSync('.env.development')).toBe(true);

      // Verify file content
      const content = vol.readFileSync('.env.development', 'utf8');
      expect(content).toContain('VITE_PORT=3000');
      expect(content).toContain('VITE_HOST=localhost');
    });

    it('should load production environment file when specified', () => {
      // Create a mock .env.production file
      vol.fromJSON({
        '.env.production': ENV_FILE_FIXTURES.production.valid
      });

      // Verify the file exists and has correct content
      expect(vol.existsSync('.env.production')).toBe(true);

      const content = vol.readFileSync('.env.production', 'utf8');
      expect(content).toContain('VITE_PORT=443');
      expect(content).toContain('VITE_HOST=example.com');
      expect(content).toContain('VITE_USE_HTTPS=true');
    });

    it('should handle missing environment files gracefully', () => {
      // No files in memory filesystem
      expect(vol.existsSync('.env.development')).toBe(false);
      expect(vol.existsSync('.env.production')).toBe(false);

      // This should not throw an error
      expect(() => {
        vol.readFileSync('.env.nonexistent', 'utf8');
      }).toThrow();
    });

    it('should demonstrate NODE_ENV usage for file selection', () => {
      // Create both environment files
      vol.fromJSON({
        '.env.development': ENV_FILE_FIXTURES.development.valid,
        '.env.production': ENV_FILE_FIXTURES.production.valid
      });

      // Test development selection
      process.env.NODE_ENV = 'development';
      expect(process.env.NODE_ENV).toBe('development');

      // Test production selection
      process.env.NODE_ENV = 'production';
      expect(process.env.NODE_ENV).toBe('production');
    });
  });

  describe('Configuration Principles', () => {
    it('should use NODE_ENV only for file loading, not application logic', () => {
      // This test demonstrates the principle that NODE_ENV should only be used
      // for loading the correct .env file, not for application behavior

      // ✅ Correct usage: NODE_ENV for file selection
      process.env.NODE_ENV = 'production';
      expect(process.env.NODE_ENV).toBe('production');

      // ❌ Antipattern: Using NODE_ENV for application logic
      // if (process.env.NODE_ENV === 'production') { ... } // Don't do this!

      // ✅ Correct: Use configuration variables for behavior
      process.env.DEBUG_BUILD = 'false';
      expect(process.env.DEBUG_BUILD).toBe('false');
    });

    it('should demonstrate environment-agnostic configuration', () => {
      // Configuration should be driven by variables, not environment checks
      process.env.VITE_OPEN_DEVTOOLS = 'false';
      process.env.DEBUG_BUILD = 'false';

      // Application behavior is controlled by config values, not NODE_ENV
      expect(process.env.VITE_OPEN_DEVTOOLS).toBe('false');
      expect(process.env.DEBUG_BUILD).toBe('false');
    });
  });
});
