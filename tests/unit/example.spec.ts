import { describe, it, expect } from 'vitest';

// This is a simple example test to demonstrate Vitest functionality
describe('Example Test Suite', () => {
  it('should pass a simple assertion', () => {
    expect(true).toBe(true);
  });

  it('should handle basic math operations', () => {
    expect(1 + 1).toBe(2);
    expect(5 - 3).toBe(2);
    expect(2 * 3).toBe(6);
  });

  it('should work with arrays', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
    expect(arr).not.toContain(4);
  });

  it('should work with objects', () => {
    const obj = { name: 'Vuetify Electron Starter', type: 'application' };
    expect(obj).toHaveProperty('name');
    expect(obj.name).toBe('Vuetify Electron Starter');
    expect(obj.type).toBe('application');
  });
});
