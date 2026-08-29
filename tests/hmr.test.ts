import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockWatch, mockWatcherOn, mockWatcherClose } = vi.hoisted(() => {
  const mockWatcherOn = vi.fn();
  const mockWatcherClose = vi.fn();
  const mockWatch = vi.fn(() => ({ on: mockWatcherOn, close: mockWatcherClose }));
  return { mockWatch, mockWatcherOn, mockWatcherClose };
});

vi.mock('chokidar', () => ({ default: { watch: mockWatch }, watch: mockWatch }));
vi.mock('node:child_process', () => ({ spawn: vi.fn(() => ({ on: vi.fn(), stdout: { on: vi.fn() }, stderr: { on: vi.fn() } })) }));

import { classify, hmrClassify, startHmrWatcher } from '../src/host/hmr.js';
import { spawn } from 'node:child_process';

describe('classify HMR', () => {
  it('dist → hot-patch', () => expect(classify('apps/web/dist/index.html')).toBe('hot-patch'));
  it('client → build:client', () => expect(classify('packages/dsh-maestro-mobile/src/client/panel.tsx')).toBe('build:client'));
  it('css.ts → build:client', () => expect(classify('packages/dsh-maestro-devkit/src/client/styles/layout.css.ts')).toBe('build:client'));
  it('host → host-restart', () => expect(classify('packages/dsh-maestro-devkit/src/host/index.ts')).toBe('host-restart'));
  it('cordis.patch.yml → host-restart', () => expect(classify('packages/dsh-maestro-devkit/cordis.patch.yml')).toBe('host-restart'));
  it('preset → preset-restart', () => expect(classify('/home/user/.dsh/.agent-presets/coder/agent.cordis.yml')).toBe('preset-restart'));
});

describe('startHmrWatcher', () => {
  beforeEach(() => {
    mockWatch.mockClear();
    mockWatcherOn.mockClear();
    mockWatcherClose.mockClear();
    vi.mocked(spawn).mockClear();
  });

  it('starts a chokidar watcher on the given paths', () => {
    const dispose = startHmrWatcher({ watchPaths: ['apps/web/dist'], targetUrl: 'http://127.0.0.1:3080' }, {});
    expect(mockWatch).toHaveBeenCalledWith(['apps/web/dist'], expect.any(Object));
    dispose();
  });

  it('registers a change listener that classifies and verifies via curl for a dist change', () => {
    const dispose = startHmrWatcher({ watchPaths: ['apps/web/dist'], targetUrl: 'http://127.0.0.1:3080' }, {});
    const changeHandler = mockWatcherOn.mock.calls.find((c: any[]) => c[0] === 'change')?.[1];
    expect(changeHandler).toBeDefined();
    changeHandler('apps/web/dist/index.html');
    expect(spawn).toHaveBeenCalledWith('curl', expect.arrayContaining(['-s', '-o', '/dev/null', '-w', '%{http_code}', 'http://127.0.0.1:3080']));
    dispose();
  });

  it('disposer closes the underlying chokidar watcher', () => {
    const dispose = startHmrWatcher({ watchPaths: ['apps/web/dist'] }, {});
    dispose();
    expect(mockWatcherClose).toHaveBeenCalled();
  });
});
