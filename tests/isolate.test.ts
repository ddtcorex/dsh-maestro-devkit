import { describe, it, expect } from 'vitest';
import { isolateUrl, isolate } from '../src/host/isolate.js';
import { cordisInspect, sessionInspect } from '../src/host/cordis.js';

describe('isolate', () => {
  it('builds sandbox URL', () => {
    const url = isolateUrl({ slot: 'layout:right-panel', props: { isOpen: true } });
    expect(url).toContain('__frontend_sandbox');
    expect(url).toContain(encodeURIComponent('layout:right-panel'));
  });
  it('isolate returns sandboxUrl', async () => {
    const r = await isolate({ slot: 'layout:main' });
    expect(r.sandboxUrl).toContain(encodeURIComponent('layout:main'));
  });
});

describe('cordis', () => {
  it('directory without args', async () => {
    const r = await cordisInspect({}, {});
    expect(r.services).toContain('sessions');
  });
  it('exact service', async () => {
    const r = await cordisInspect({ service: 'sessions' }, {});
    expect(r.service).toBe('sessions');
  });
  it('sessionInspect cwd', async () => {
    const r = await sessionInspect({ action: 'list' }, { sessions: {} } as any);
    expect(r.sessions).toBeDefined();
  });
});
