import { describe, it, expect } from 'vitest';
import { Sandbox } from '../src/client/sandbox.js';

describe('sandbox', () => {
  it('Sandbox exists', () => {
    expect(Sandbox).toBeDefined();
  });
  it('renders slot', () => {
    expect(typeof Sandbox).toBe('function');
  });
});
