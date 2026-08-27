import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { resolveTargetUrl } from '../src/host/config.js';

describe('resolveTargetUrl', () => {
  const origEnv = process.env.DSH_FRONTEND_URL;

  afterEach(() => {
    if (origEnv === undefined) delete process.env.DSH_FRONTEND_URL;
    else process.env.DSH_FRONTEND_URL = origEnv;
    vi.restoreAllMocks();
  });

  it('defaults to local when auto and no tunnel', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    const url = await resolveTargetUrl('auto');
    expect(url).toBe('http://127.0.0.1:3080');
  });

  it('returns tunnel when input is tunnel and remote.tunnelUrl exists', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({ 'dsh-maestro-remote': { tunnelUrl: 'https://dsh-company.ddtcorex.com' } }));
    const url = await resolveTargetUrl('tunnel');
    expect(url).toBe('https://dsh-company.ddtcorex.com');
  });

  it('env override wins', async () => {
    process.env.DSH_FRONTEND_URL = 'http://example.com';
    const url = await resolveTargetUrl('auto');
    expect(url).toBe('http://example.com');
  });

  it('explicit string passthrough', async () => {
    expect(await resolveTargetUrl('http://myhost:3080')).toBe('http://myhost:3080');
  });

  it('local returns localhost', async () => {
    expect(await resolveTargetUrl('local')).toBe('http://127.0.0.1:3080');
  });
});
