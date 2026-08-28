import { describe, it, expect } from 'vitest';
import { classify } from '../src/host/hmr.js';

describe('classify HMR', () => {
  it('dist → hot-patch', () => expect(classify('apps/web/dist/index.html')).toBe('hot-patch'));
  it('client → build:client', () => expect(classify('packages/dsh-maestro-mobile/src/client/panel.tsx')).toBe('build:client'));
  it('css.ts → build:client', () => expect(classify('packages/dsh-maestro-devkit/src/client/styles/layout.css.ts')).toBe('build:client'));
  it('host → host-restart', () => expect(classify('packages/dsh-maestro-devkit/src/host/index.ts')).toBe('host-restart'));
  it('cordis.patch.yml → host-restart', () => expect(classify('packages/dsh-maestro-devkit/cordis.patch.yml')).toBe('host-restart'));
  it('preset → preset-restart', () => expect(classify('/home/user/.dsh/.agent-presets/coder/agent.cordis.yml')).toBe('preset-restart'));
});
