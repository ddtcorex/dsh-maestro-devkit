/**
 * frontend_hmr — classify reload need, watch for it, double-verify (local + tunnel)
 */
import chokidar from 'chokidar';
import { spawn } from 'node:child_process';
export function classify(file) {
    if (file.includes('apps/web/dist/'))
        return 'hot-patch';
    if (file.includes('src/client') || file.endsWith('.css.ts') || file.includes('src/client/'))
        return 'build:client';
    if (file.includes('src/host') || file.includes('cordis.patch.yml') || file.includes('package.json'))
        return 'host-restart';
    if (file.includes('.agent-presets') || file.includes('.dsh/.agent-presets'))
        return 'preset-restart';
    if (file.match(/\.(tsx|ts|css)$/) && file.includes('client'))
        return 'build:client';
    return 'hot-patch';
}
export async function hmrClassify(input) {
    const action = classify(input.changedFile);
    return { action, changedFile: input.changedFile, verifyTunnel: true };
}
function curlStatus(url) {
    return new Promise((resolve) => {
        const proc = spawn('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', url]);
        let out = '';
        proc.stdout?.on('data', (d) => { out += d.toString(); });
        proc.on('close', () => resolve(out));
    });
}
/**
 * Start a reversible chokidar watcher. On a matched change, classify the
 * action and verify the target URL responds — actually triggering
 * build:client/host-restart is intentionally out of scope here: devkit is
 * a consumer only. Host restarts belong to the supervisor-owned
 * `dsh-safe-restart` skill (`<workspace-root>/packages/dsh-maestro-supervisor/
 * skills/dsh-safe-restart/SKILL.md`) and its in-session `dsh_web_restart`
 * tool; devkit must never instruct or execute its own restart. This watcher
 * classifies + verifies + logs, giving the developer the same signal
 * frontend_hmr's tool call does.
 */
export function startHmrWatcher(opts, ctx) {
    const log = ctx?.logger?.('maestro-devkit-hmr') ?? { info: () => { }, warn: () => { }, error: () => { } };
    const watcher = chokidar.watch(opts.watchPaths, { ignoreInitial: true });
    watcher.on('change', async (changedFile) => {
        const action = classify(changedFile);
        log.info(`[hmr] ${changedFile} -> ${action}`);
        if (opts.targetUrl) {
            const status = await curlStatus(opts.targetUrl);
            log.info(`[hmr] verify ${opts.targetUrl} -> ${status}`);
        }
    });
    watcher.on('error', (err) => {
        log.warn(`[hmr] watcher error: ${String(err)}`);
    });
    return () => { try {
        watcher.close();
    }
    catch { } };
}
//# sourceMappingURL=hmr.js.map