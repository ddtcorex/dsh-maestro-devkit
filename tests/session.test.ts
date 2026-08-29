import { describe, it, expect } from 'vitest';
import { sessionInspect } from '../src/host/cordis.js';

describe('devkit_session', () => {
  it('list returns real session summaries from ctx.sessions.list()', async () => {
    const fakeSessions = [
      { header: { id: 'sess-1', cwd: '/tmp/proj-a' } },
      { header: { id: 'sess-2', cwd: '/tmp/proj-b' } },
    ];
    const ctx = { get: (name: string) => (name === 'sessions' ? { list: () => fakeSessions } : undefined) };
    const r = await sessionInspect({ action: 'list' }, ctx);
    expect(r.sessions).toEqual([
      { id: 'sess-1', cwd: '/tmp/proj-a' },
      { id: 'sess-2', cwd: '/tmp/proj-b' },
    ]);
  });

  it('list returns empty array with a note when sessions service is unavailable', async () => {
    const ctx = { get: () => undefined };
    const r = await sessionInspect({ action: 'list' }, ctx);
    expect(r.sessions).toEqual([]);
  });

  it('inspect-by-id returns the cwd of the matched session', async () => {
    const fakeSession = { header: { id: 'sess-1', cwd: '/tmp/proj-a' } };
    const ctx = { get: (name: string) => (name === 'sessions' ? { get: (id: string) => (id === 'sess-1' ? fakeSession : undefined) } : undefined) };
    const r = await sessionInspect({ sessionId: 'sess-1' }, ctx);
    expect(r.cwd).toBe('/tmp/proj-a');
    expect(r.sessionId).toBe('sess-1');
  });

  it('inspect-by-id falls back to process.cwd() when session not found', async () => {
    const ctx = { get: (name: string) => (name === 'sessions' ? { get: () => undefined } : undefined) };
    const r = await sessionInspect({ sessionId: 'missing' }, ctx);
    expect(r.cwd).toBe(process.cwd());
  });
});
