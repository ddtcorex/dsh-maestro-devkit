import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventEmitter } from 'node:events';

vi.mock('node:child_process', () => ({ spawn: vi.fn() }));
import { spawn } from 'node:child_process';
import { govardCmd, govardRun } from '../src/host/govard.js';

function mockChildProcess(exitCode: number, stdout = '', stderr = '') {
  const proc: any = new EventEmitter();
  proc.stdout = new EventEmitter();
  proc.stderr = new EventEmitter();
  setImmediate(() => {
    if (stdout) proc.stdout.emit('data', Buffer.from(stdout));
    if (stderr) proc.stderr.emit('data', Buffer.from(stderr));
    proc.emit('close', exitCode);
  });
  return proc;
}

describe('govard', () => {
  beforeEach(() => vi.clearAllMocks());

  it('resolves cwd from sessionCwd not process.cwd', () => {
    expect(govardCmd('make test', { sessionCwd: '/tmp/maestro-mr-123' })).toContain('/tmp/maestro-mr-123');
  });

  it('spawns "make" with argv ["test"] for allowed command "make test"', async () => {
    vi.mocked(spawn).mockReturnValue(mockChildProcess(0, 'ok\n') as any);
    const r = await govardRun({ cmd: 'make test', sessionCwd: '/tmp/maestro-mr-123' }, {} as any);
    expect(spawn).toHaveBeenCalledWith('make', ['test'], expect.objectContaining({ cwd: '/tmp/maestro-mr-123' }));
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toBe('ok\n');
    expect(r.cwd).toBe('/tmp/maestro-mr-123');
  });

  it('spawns "govard" with argv ["env","up"] for allowed command "govard env up"', async () => {
    vi.mocked(spawn).mockReturnValue(mockChildProcess(0) as any);
    await govardRun({ cmd: 'govard env up', sessionCwd: '/tmp/x' }, {} as any);
    expect(spawn).toHaveBeenCalledWith('govard', ['env', 'up'], expect.objectContaining({ cwd: '/tmp/x' }));
  });

  it('rejects a command not on the allowlist without spawning anything', async () => {
    await expect(govardRun({ cmd: 'rm -rf /', sessionCwd: '/tmp/x' }, {} as any)).rejects.toThrow(/not allowed/i);
    expect(spawn).not.toHaveBeenCalled();
  });

  it('falls back to session header cwd when sessionCwd/workdir absent', async () => {
    vi.mocked(spawn).mockReturnValue(mockChildProcess(0) as any);
    const r = await govardRun({ cmd: 'make build' }, { exec: { agent: { session: { header: { cwd: '/tmp/maestro-mr-123' } } } } } as any);
    expect(r.cwd).toBe('/tmp/maestro-mr-123');
  });

  it('returns non-zero exitCode without throwing on command failure', async () => {
    vi.mocked(spawn).mockReturnValue(mockChildProcess(1, '', 'boom\n') as any);
    const r = await govardRun({ cmd: 'make test', sessionCwd: '/tmp/x' }, {} as any);
    expect(r.exitCode).toBe(1);
    expect(r.stderr).toBe('boom\n');
  });
});
