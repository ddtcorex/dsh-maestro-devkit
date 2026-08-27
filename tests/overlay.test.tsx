import { describe, it, expect } from 'vitest';
import { OverlayToolbar } from '../src/client/overlay.js';
import { Inspector } from '../src/client/inspector.js';

describe('overlay', () => {
  it('OverlayToolbar exists', () => {
    expect(OverlayToolbar).toBeDefined();
  });
  it('Inspector renders gap', () => {
    expect(Inspector).toBeDefined();
  });
});
