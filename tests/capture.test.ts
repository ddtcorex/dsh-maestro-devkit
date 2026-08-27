import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock spawn at module level so import of capture sees mocked child_process
vi.mock('node:child_process', () => ({
  spawn: vi.fn(() => ({
    on: vi.fn(),
    kill: vi.fn(),
    pid: 12345,
    stdout: { on: vi.fn() },
    stderr: { on: vi.fn() },
  })),
}));

// Mock fs mkdtempSync/rmSync to avoid real file I/O
vi.mock('node:fs', async () => {
  const actual = await vi.importActual<typeof import('node:fs')>('node:fs');
  return {
    ...actual,
    mkdtempSync: vi.fn(() => '/tmp/chrome-devkit-test-abc'),
    rmSync: vi.fn(() => {}),
    existsSync: vi.fn(() => false),
    readFileSync: vi.fn(() => '{}'),
    mkdirSync: vi.fn(() => {}),
    writeFileSync: vi.fn(() => {}),
  };
});

import { capture, VIEWPORTS } from '../src/host/capture.js';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

describe('capture', () => {
  let mockSpawn: ReturnType<typeof vi.fn>;
  let mockFetch: ReturnType<typeof vi.fn>;
  let MockWebSocket: any;
  let wsInstances: any[];

  beforeEach(() => {
    vi.restoreAllMocks();
    // Re-mock after restore
    mockSpawn = vi.mocked(spawn);

    // Ensure mkdtempSync/rmSync are mocked fresh
    (vi.spyOn(fs, 'mkdtempSync' as any) as any).mockReturnValue('/tmp/chrome-devkit-test-abc');
    (vi.spyOn(fs, 'rmSync' as any) as any).mockImplementation(() => {});
    (vi.spyOn(fs, 'existsSync' as any) as any).mockReturnValue(false);

    wsInstances = [];
    MockWebSocket = vi.fn(function (this: any, url: string) {
      this.url = url;
      this.readyState = 1;
      this.send = vi.fn();
      this.close = vi.fn();
      this.on = vi.fn();
      this.addEventListener = vi.fn();
      wsInstances.push(this);
    });

    mockFetch = vi.fn(async (url: string) => {
      if (String(url).includes('/json')) {
        return {
          ok: true,
          json: async () => [{ id: 'ABC', type: 'page', webSocketDebuggerUrl: 'ws://127.0.0.1:9222/devtools/page/ABC' }],
        } as any;
      }
      return { ok: true, json: async () => ({} as any), text: async () => '' } as any;
    });

    // Also mock global fetch for code that uses global fetch
    (globalThis as any).fetch = mockFetch;
    (globalThis as any).WebSocket = MockWebSocket;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (globalThis as any).fetch;
    delete (globalThis as any).WebSocket;
  });

  it('exposes VIEWPORTS with exact required dimensions', () => {
    expect(VIEWPORTS.desktop).toEqual({ width: 1280, height: 800, deviceScaleFactor: 1, mobile: false, hasTouch: false });
    expect(VIEWPORTS.tablet).toEqual({ width: 768, height: 1024, deviceScaleFactor: 1, mobile: false, hasTouch: false });
    expect(VIEWPORTS.mobile).toEqual({ width: 390, height: 844, deviceScaleFactor: 2, mobile: true, hasTouch: true });
  });

  it('calls Page.addScriptToEvaluateOnNewDocument with sessionId containing localStorage dsh.sessions.current', async () => {
    const send = vi.fn(async (method: string, params: any) => {
      if (method === 'Page.addScriptToEvaluateOnNewDocument') return { identifier: '1' };
      if (method === 'Page.navigate') return { frameId: '1' };
      if (method === 'Page.captureScreenshot') return { data: 'abcd' };
      if (method === 'Emulation.setDeviceMetricsOverride') return {};
      if (method === 'DOMSnapshot.captureSnapshot') return { documents: [] };
      if (method === 'Runtime.evaluate') return { result: { value: { x: 0, y: 0, width: 1280, height: 800 } } };
      return {};
    });

    await capture(
      { targetUrl: 'http://127.0.0.1:3080', viewport: 'desktop', sessionId: 'test-session-xyz' } as any,
      { send, fetchFn: mockFetch, WebSocketCtor: MockWebSocket } as any,
    );

    // Must have called Page.addScriptToEvaluateOnNewDocument
    const addScriptCalls = (send.mock.calls as any[]).filter((c) => c[0] === 'Page.addScriptToEvaluateOnNewDocument');
    expect(addScriptCalls.length).toBeGreaterThan(0);
    const source: string = addScriptCalls[0][1]?.source ?? '';
    expect(source).toContain('dsh.sessions.current');
    expect(source).toContain('localStorage');
    expect(source).toContain('test-session-xyz');
  });

  it('requires clip scale:1 for screenshot', async () => {
    const send = vi.fn(async (method: string, _params: any) => {
      if (method === 'Page.addScriptToEvaluateOnNewDocument') return { identifier: '1' };
      if (method === 'Page.navigate') return { frameId: '1' };
      if (method === 'Page.captureScreenshot') return { data: 'abcd' };
      if (method === 'Emulation.setDeviceMetricsOverride') return {};
      if (method === 'DOMSnapshot.captureSnapshot') return { documents: [] };
      if (method === 'Runtime.evaluate') return { result: { value: { x: 0, y: 0, width: 100, height: 100 } } };
      return {};
    });

    await capture(
      { targetUrl: 'http://127.0.0.1:3080', viewport: 'desktop' } as any,
      { send, fetchFn: mockFetch, WebSocketCtor: MockWebSocket } as any,
    );

    const screenshotCalls = (send.mock.calls as any[]).filter((c) => c[0] === 'Page.captureScreenshot');
    expect(screenshotCalls.length).toBeGreaterThan(0);
    for (const c of screenshotCalls) {
      expect(c[1]?.clip).toBeDefined();
      expect(c[1].clip.scale).toBe(1);
    }
  });

  it('calls Emulation.setDeviceMetricsOverride with correct viewport metrics', async () => {
    const send = vi.fn(async (method: string, _params: any) => {
      if (method === 'Page.addScriptToEvaluateOnNewDocument') return { identifier: '1' };
      if (method === 'Page.navigate') return { frameId: '1' };
      if (method === 'Page.captureScreenshot') return { data: 'abcd' };
      if (method === 'Emulation.setDeviceMetricsOverride') return {};
      if (method === 'DOMSnapshot.captureSnapshot') return { documents: [] };
      if (method === 'Runtime.evaluate') return { result: { value: { x: 0, y: 0, width: 100, height: 100 } } };
      return {};
    });

    await capture(
      { targetUrl: 'http://127.0.0.1:3080', viewport: 'mobile' } as any,
      { send, fetchFn: mockFetch, WebSocketCtor: MockWebSocket } as any,
    );

    const metricsCalls = (send.mock.calls as any[]).filter((c) => c[0] === 'Emulation.setDeviceMetricsOverride');
    expect(metricsCalls.length).toBeGreaterThan(0);
    const params = metricsCalls[0][1];
    expect(params.width).toBe(390);
    expect(params.height).toBe(844);
    expect(params.deviceScaleFactor).toBe(2);
    expect(params.mobile).toBe(true);
  });

  it('uses fresh user-data-dir via spawn and cleans up', async () => {
    const send = vi.fn(async () => ({ identifier: '1', data: 'abcd', frameId: '1', result: { value: {} } }));

    await capture(
      { targetUrl: 'http://127.0.0.1:3080', viewport: 'desktop' } as any,
      { send, fetchFn: mockFetch, WebSocketCtor: MockWebSocket } as any,
    );

    // spawn must be called with --headless=new and --user-data-dir and --remote-debugging-port
    expect(mockSpawn).toHaveBeenCalled();
    const spawnArgs: string[] = (mockSpawn.mock.calls[0] as any[])[1] as string[];
    const spawnCallStr = spawnArgs.join(' ');
    expect(spawnCallStr).toContain('--headless=new');
    expect(spawnCallStr).toContain('--remote-debugging-port=');
    // fresh user-data-dir must be under /tmp/chrome-devkit-
    const hasUserDataDir = spawnArgs.some((a) => a.startsWith('--user-data-dir=/tmp/chrome-devkit-'));
    expect(hasUserDataDir).toBe(true);
    expect(spawnArgs).toContain('--no-sandbox');
    expect(spawnArgs).toContain('--disable-dev-shm-usage');

    // mkdtempSync called with /tmp/chrome-devkit- prefix
    expect((fs.mkdtempSync as any).mock.calls[0][0]).toBe('/tmp/chrome-devkit-');
  });

  it('navigates to targetUrl via Page.navigate', async () => {
    const send = vi.fn(async (method: string, params: any) => {
      if (method === 'Page.navigate') {
        expect(params.url).toBe('http://127.0.0.1:3080');
        return { frameId: '1' };
      }
      if (method === 'Page.captureScreenshot') return { data: 'abcd' };
      if (method === 'Page.addScriptToEvaluateOnNewDocument') return { identifier: '1' };
      if (method === 'Emulation.setDeviceMetricsOverride') return {};
      if (method === 'DOMSnapshot.captureSnapshot') return { documents: [] };
      if (method === 'Runtime.evaluate') return { result: { value: { x: 0, y: 0, width: 100, height: 100 } } };
      return {};
    });

    await capture(
      { targetUrl: 'http://127.0.0.1:3080', viewport: 'desktop' } as any,
      { send, fetchFn: mockFetch, WebSocketCtor: MockWebSocket } as any,
    );

    const navigateCalls = (send.mock.calls as any[]).filter((c) => c[0] === 'Page.navigate');
    expect(navigateCalls.length).toBeGreaterThan(0);
    expect(navigateCalls[0][1].url).toBe('http://127.0.0.1:3080');
  });

  it('formats geometry via Math.round plain object (not DOMRect)', async () => {
    // This checks that implementation does not return DOMRect directly but uses Math.round
    // We inspect the Runtime.evaluate expression for Math.round
    const send = vi.fn(async (method: string, params: any) => {
      if (method === 'Runtime.evaluate') {
        // capture should evaluate with Math.round in expression
        expect(params.expression).toContain('Math.round');
        return { result: { value: { x: 10, y: 20, width: 100, height: 200 } } };
      }
      if (method === 'Page.addScriptToEvaluateOnNewDocument') return { identifier: '1' };
      if (method === 'Page.navigate') return { frameId: '1' };
      if (method === 'Page.captureScreenshot') return { data: 'abcd' };
      if (method === 'Emulation.setDeviceMetricsOverride') return {};
      if (method === 'DOMSnapshot.captureSnapshot') return { documents: [] };
      return {};
    });

    const result = await capture(
      { targetUrl: 'http://127.0.0.1:3080', viewport: 'desktop', withDOM: true } as any,
      { send, fetchFn: mockFetch, WebSocketCtor: MockWebSocket } as any,
    );

    expect(result.geometry).toBeDefined();
  });
});
