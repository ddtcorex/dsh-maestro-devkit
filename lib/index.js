/**
 * dsh-maestro-devkit — host half
 * General DSH development toolkit.
 * Implements 9 tools via reversible effects, isolate realm `devkit`.
 */
import { resolveTargetUrl } from './config.js';
import { capture } from './capture.js';
import { inspect } from './inspect.js';
import { classify, startHmrWatcher } from './hmr.js';
import { isolate } from './isolate.js';
import { sessionInspect } from './cordis.js';
import { govardRun } from './govard.js';
import { skillsAction } from './skills.js';
export { resolveTargetUrl };
export { capture, VIEWPORTS } from './capture.js';
export { inspect } from './inspect.js';
export { classify, hmrClassify, startHmrWatcher } from './hmr.js';
export { isolate, isolateUrl } from './isolate.js';
export { sessionInspect } from './cordis.js';
export { govardRun } from './govard.js';
export { skillsAction } from './skills.js';
export const inject = ['tools', 'connection', 'sessions'];
export function apply(ctx, config = {}) {
    const log = ctx.logger?.('maestro-devkit') ?? { info: () => { }, warn: () => { }, error: () => { } };
    if (config.watch !== false) {
        ctx.effect(() => startHmrWatcher({ watchPaths: ['apps/web/dist', 'packages/*/src'], targetUrl: config.targetUrl ?? undefined }, ctx));
    }
    // Register tools as reversible effects
    ctx.effect(() => {
        const tools = ctx.get?.('tools');
        if (!tools?.register) {
            log.warn('tools registry not available, devkit tools not registered');
            return () => { };
        }
        const disposers = [];
        // Minimal placeholder tools — real implementations in writing-plans Phase 1
        const register = (name, description, handler) => {
            try {
                const d = tools.register({ name, description, handler });
                if (typeof d === 'function')
                    disposers.push(d);
                else if (d?.dispose)
                    disposers.push(() => d.dispose());
            }
            catch (e) {
                log.warn(`failed to register ${name}: ${String(e)}`);
            }
        };
        register('frontend_capture', 'Capture DSH Web UI (3 viewports + DOM + geometry, tunnel-aware)', async (input) => {
            const opts = {
                targetUrl: input?.targetUrl ?? config.targetUrl ?? 'auto',
                viewport: input?.viewport ?? 'all',
                fullPage: Boolean(input?.fullPage),
                withDOM: Boolean(input?.withDOM),
                sessionId: input?.sessionId,
            };
            const result = await capture(opts);
            return result;
        });
        register('frontend_inspect', 'Inspect computedStyle + tokens + slots (tunnel-aware)', async (input) => {
            return await inspect(input ?? {}, ctx);
        });
        register('frontend_hmr', 'Classify HMR need and trigger (tunnel double-verify)', async (input) => {
            const changedFile = input?.changedFile ?? input?.file ?? '';
            const action = classify(changedFile);
            return { action, changedFile, verifyTunnel: true, config };
        });
        register('frontend_isolate', 'Sandbox single slot (isolate)', async (input) => {
            return await isolate(input ?? { slot: 'layout:main' }, ctx);
        });
        register('devkit_session', 'Inspect DSH sessions (cwd aware)', async (input) => {
            return await sessionInspect(input ?? {}, ctx);
        });
        register('devkit_govard', 'Govard wrapper (session cwd aware)', async (input) => {
            return await govardRun(input ?? { cmd: 'make test' }, ctx);
        });
        register('devkit_skills', 'Skills wrapper (list/scaffold)', async (input) => {
            return await skillsAction(input ?? { action: 'list' }, ctx);
        });
        log.info(`maestro-devkit host registered 7 tools (targetUrl=${config.targetUrl ?? 'auto'})`);
        return () => {
            for (const d of disposers)
                try {
                    d();
                }
                catch { }
        };
    });
    // Host→Client RPC for floating bar
    ctx.effect(() => {
        const conn = ctx.get?.('connection');
        if (!conn?.rpc?.handle)
            return () => { };
        const dispose = conn.rpc.handle('/dsh-maestro-devkit', async (payload) => {
            const action = payload?.action;
            if (action === 'capture') {
                return await capture({ targetUrl: config.targetUrl ?? 'auto' });
            }
            if (action === 'inspect') {
                return await inspect(payload ?? {}, ctx);
            }
            return { echo: payload, status: 'ok' };
        }, { authority: 'loopback' });
        return () => { try {
            dispose?.();
        }
        catch { } };
    });
}
export default { apply };
//# sourceMappingURL=index.js.map