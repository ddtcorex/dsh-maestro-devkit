import { describe, it, expect } from 'vitest';
import { isolateUrl, isolate } from '../src/host/isolate.js';

describe('isolate', () => {
  it('builds a query-param sandbox URL on the existing root path', () => {
    const url = isolateUrl({ slot: 'layout:right-panel', props: { isOpen: true } });
    expect(url).toMatch(/^\/\?__devkit_sandbox=/);
    expect(url).toContain(encodeURIComponent('layout:right-panel'));
    expect(url).toContain('props=');
  });

  it('isolate returns sandboxUrl using the query-param scheme', async () => {
    const r = await isolate({ slot: 'layout:main' });
    expect(r.sandboxUrl).toMatch(/^\/\?__devkit_sandbox=/);
    expect(r.sandboxUrl).toContain(encodeURIComponent('layout:main'));
  });

  it('does not build the old dedicated-route URL', async () => {
    const url = isolateUrl({ slot: 'layout:main' });
    expect(url).not.toContain('__frontend_sandbox');
  });
});
