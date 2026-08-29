/**
 * frontend_hmr — classify reload need, watch for it, double-verify (local + tunnel)
 */
import chokidar from 'chokidar';
import { spawn } from 'node:child_process';

export type HmrAction = 'hot-patch' | 'build:client' | 'host-restart' | 'preset-restart';

export function classify(file: string): HmrAction {
  if (file.includes('apps/web/dist/')) return 'hot-patch';
  if (file.includes('src/client') || file.endsWith('.css.ts') || file.includes('src/client/')) return 'build:client';
  if (file.includes('src/host') || file.includes('cordis.patch.yml') || file.includes('package.json')) return 'host-restart';
  if (file.includes('.agent-presets') || file.includes('.dsh/.agent-presets')) return 'preset-restart';
  if (file.match(/\.(tsx|ts|css)$/) && file.includes('client')) return 'build:client';
  return 'hot-patch';
}

export async function hmrClassify(input: { changedFile: string; targetUrl?: string }) {
  const action = classify(input.changedFile);
  return { action, changedFile: input.changedFile, verifyTunnel: true };
}

function curlStatus(url: string): Promise<string> {
  return new Promise((resolve) => {
    const proc = spawn('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', url]);
    let out = '';
    proc.stdout?.on('data', (d: Buffer) => { out += d.toString(); });
    proc.on('close', () => resolve(out));
  });
}

/**
 * Start a reversible chokidar watcher. On a matched change, classify the
 * action and verify the target URL responds — actually triggering
 * build:client/host-restart is intentionally out of MVP scope here (that
 * would call into dsh-safe-web-update's consent-gated restart flow, which
 * must not be automated silently); this watcher classifies + verifies +
 * logs, giving the developer the same signal frontend_hmr's tool call does.
 */
export function startHmrWatcher(
  opts: { watchPaths: string[]; targetUrl?: string },
  ctx: any,
): () => void {
  const log = ctx?.logger?.('maestro-devkit-hmr') ?? { info: () => {}, warn: () => {}, error: () => {} };
  const watcher = chokidar.watch(opts.watchPaths, { ignoreInitial: true });
  watcher.on('change', async (changedFile: string) => {
    const action = classify(changedFile);
    log.info(`[hmr] ${changedFile} -> ${action}`);
    if (opts.targetUrl) {
      const status = await curlStatus(opts.targetUrl);
      log.info(`[hmr] verify ${opts.targetUrl} -> ${status}`);
    }
  });
  watcher.on('error', (err: unknown) => {
    log.warn(`[hmr] watcher error: ${String(err)}`);
  });
  return () => { try { watcher.close(); } catch {} };
}
