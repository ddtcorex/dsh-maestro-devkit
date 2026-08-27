import { describe, it, expect } from 'vitest';
import { govardCmd, govardRun } from '../src/host/govard.js';
import { skillsAction } from '../src/host/skills.js';
import { pluginAction } from '../src/host/plugin.js';

describe('govard', () => {
  it('resolves cwd from sessionCwd not process.cwd', () => {
    expect(govardCmd('make test', { sessionCwd: '/tmp/maestro-mr-123' })).toContain('/tmp/maestro-mr-123');
  });
  it('govardRun uses session header', async () => {
    const r = await govardRun({ cmd: 'make test', sessionCwd: '/tmp/maestro-mr-123' }, { exec: { agent: { session: { header: { cwd: '/tmp/maestro-mr-123' } } } } } as any);
    expect(r.cwd).toBe('/tmp/maestro-mr-123');
  });
});

describe('skills', () => {
  it('list', async () => {
    const r = await skillsAction({ action: 'list' }, {} as any);
    expect(r.skills.length).toBeGreaterThan(0);
  });
});

describe('plugin', () => {
  it('define', async () => {
    const r = await pluginAction({ action: 'define' }, {} as any);
    expect(r.pluginId).toBeDefined();
  });
});
