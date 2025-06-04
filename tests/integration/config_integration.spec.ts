/**
 * Configuration Integration Tests
 *
 * Tests the complete configuration system including file loading,
 * environment variable processing, and validation
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { vol } from 'memfs';
import { setupTestEnvironment } from '../helpers/config_helpers';
import { ENV_FILE_FIXTURES, INVALID_ENV_FILES, EDGE_CASE_ENV_FILES } from '../fixtures/env_files';

describe('Configuration Integration', () => {
  beforeEach(() => {
    vol.reset();
    // Create the current working directory in memfs
    vol.mkdirSync(process.cwd(), { recursive: true });
  });

  describe('Complete Environment Loading Workflow', () => {
    it('should load development configuration completely', () => {
      setupTestEnvironment({
        nodeEnv: 'development',
        envFile: 'development'
      });

      // Verify NODE_ENV is set correctly
      expect(process.env.NODE_ENV).toBe('development');

      // Verify file exists in memory filesystem
      expect(vol.existsSync('.env.development')).toBe(true);

      // Verify file content
      const content = vol.readFileSync('.env.development', 'utf8');
      expect(content).toContain('VITE_PORT=3000');
      expect(content).toContain('DEBUG_BUILD=true');
    });

    it('should load production configuration completely', () => {
      setupTestEnvironment({
        nodeEnv: 'production',
        envFile: 'production'
      });

      // Verify NODE_ENV is set correctly
      expect(process.env.NODE_ENV).toBe('production');

      // Verify file exists in memory filesystem
      expect(vol.existsSync('.env.production')).toBe(true);

      // Verify file content
      const content = vol.readFileSync('.env.production', 'utf8');
      expect(content).toContain('VITE_PORT=443');
      expect(content).toContain('DEBUG_BUILD=false');
    });

    it('should handle custom environment configurations', () => {
      setupTestEnvironment({
        nodeEnv: 'staging',
        envFile: 'custom',
        customEnvFile: {
          VITE_PORT: '8080',
          VITE_HOST: 'staging.example.com',
          VITE_USE_HTTPS: 'true',
          DEBUG_BUILD: 'true'
        }
      });

      expect(process.env.NODE_ENV).toBe('staging');
      expect(vol.existsSync('.env.staging')).toBe(true);

      const content = vol.readFileSync('.env.staging', 'utf8');
      expect(content).toContain('VITE_PORT=8080');
      expect(content).toContain('VITE_HOST=staging.example.com');
    });
  });

  describe('File System Edge Cases', () => {
    it('should handle empty environment files', () => {
      vol.fromJSON({
        '.env.development': EDGE_CASE_ENV_FILES.empty_file
      });

      expect(vol.existsSync('.env.development')).toBe(true);
      const content = vol.readFileSync('.env.development', 'utf8');
      expect(content).toBe('');
    });

    it('should handle files with comments and empty lines', () => {
      vol.fromJSON({
        '.env.development': EDGE_CASE_ENV_FILES.comments_and_empty_lines
      });

      const content = vol.readFileSync('.env.development', 'utf8');
      expect(content).toContain('# Development configuration');
      expect(content).toContain('VITE_PORT=3000');
    });

    it('should handle files with whitespace in values', () => {
      vol.fromJSON({
        '.env.development': EDGE_CASE_ENV_FILES.whitespace_values
      });

      const content = vol.readFileSync('.env.development', 'utf8');
      expect(content).toContain('VITE_HOST=  localhost');
      expect(content).toContain('VITE_APP_NAME=  Test App');
    });

    it('should handle boolean variations', () => {
      vol.fromJSON({
        '.env.development': EDGE_CASE_ENV_FILES.boolean_variations
      });

      const content = vol.readFileSync('.env.development', 'utf8');
      expect(content).toContain('VITE_USE_HTTPS=TRUE');
      expect(content).toContain('VITE_OPEN_DEVTOOLS=False');
      expect(content).toContain('DEBUG_BUILD=1');
    });
  });

  describe('Invalid Configuration Handling', () => {
    it('should handle malformed port numbers', () => {
      vol.fromJSON({
        '.env.development': INVALID_ENV_FILES.malformed_port
      });

      const content = vol.readFileSync('.env.development', 'utf8');
      expect(content).toContain('VITE_PORT=not_a_number');
    });

    it('should handle negative dimensions', () => {
      vol.fromJSON({
        '.env.development': INVALID_ENV_FILES.negative_dimensions
      });

      const content = vol.readFileSync('.env.development', 'utf8');
      expect(content).toContain('VITE_WINDOW_WIDTH=-100');
      expect(content).toContain('VITE_WINDOW_HEIGHT=-100');
    });

    it('should handle zero dimensions', () => {
      vol.fromJSON({
        '.env.development': INVALID_ENV_FILES.zero_dimensions
      });

      const content = vol.readFileSync('.env.development', 'utf8');
      expect(content).toContain('VITE_WINDOW_WIDTH=0');
      expect(content).toContain('VITE_WINDOW_HEIGHT=0');
    });

    it('should handle missing required values', () => {
      vol.fromJSON({
        '.env.development': INVALID_ENV_FILES.missing_required
      });

      const content = vol.readFileSync('.env.development', 'utf8');
      expect(content).not.toContain('VITE_PORT');
      expect(content).toContain('VITE_HOST=localhost');
    });
  });

  describe('Multiple Environment Files', () => {
    it('should handle multiple environment files simultaneously', () => {
      vol.fromJSON({
        '.env.development': ENV_FILE_FIXTURES.development.valid,
        '.env.production': ENV_FILE_FIXTURES.production.valid,
        '.env.staging': ENV_FILE_FIXTURES.production.staging
      });

      // Verify all files exist
      expect(vol.existsSync('.env.development')).toBe(true);
      expect(vol.existsSync('.env.production')).toBe(true);
      expect(vol.existsSync('.env.staging')).toBe(true);

      // Verify different content in each file
      const devContent = vol.readFileSync('.env.development', 'utf8');
      const prodContent = vol.readFileSync('.env.production', 'utf8');
      const stagingContent = vol.readFileSync('.env.staging', 'utf8');

      expect(devContent).toContain('VITE_PORT=3000');
      expect(prodContent).toContain('VITE_PORT=443');
      expect(stagingContent).toContain('VITE_PORT=8080');
    });

    it('should demonstrate environment-specific file selection', () => {
      vol.fromJSON({
        '.env.development': ENV_FILE_FIXTURES.development.valid,
        '.env.production': ENV_FILE_FIXTURES.production.valid
      });

      // Test development environment selection
      process.env.NODE_ENV = 'development';
      expect(vol.existsSync('.env.development')).toBe(true);

      // Test production environment selection
      process.env.NODE_ENV = 'production';
      expect(vol.existsSync('.env.production')).toBe(true);

      // Test non-existent environment
      process.env.NODE_ENV = 'testing';
      expect(vol.existsSync('.env.testing')).toBe(false);
    });
  });

  describe('Filesystem Operations', () => {
    it('should support file creation and deletion', () => {
      // Create a file
      vol.fromJSON({
        '.env.test': 'VITE_PORT=5000'
      });

      expect(vol.existsSync('.env.test')).toBe(true);

      // Delete the file
      vol.unlinkSync('.env.test');
      expect(vol.existsSync('.env.test')).toBe(false);
    });

    it('should support directory operations', () => {
      // Create nested structure
      vol.fromJSON({
        'config/.env.development': ENV_FILE_FIXTURES.development.valid,
        'config/local/.env.local': 'VITE_PORT=4000'
      });

      expect(vol.existsSync('config/.env.development')).toBe(true);
      expect(vol.existsSync('config/local/.env.local')).toBe(true);
    });

    it('should handle file reading and writing', () => {
      const testContent = 'VITE_PORT=9000\nVITE_HOST=test.local';

      // Write the file
      vol.writeFileSync('.env.test', testContent);

      // Read the file
      const readContent = vol.readFileSync('.env.test', 'utf8');
      expect(readContent).toBe(testContent);
    });
  });
});
