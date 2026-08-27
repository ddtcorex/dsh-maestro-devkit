/**
 * dsh-maestro-devkit — host half
 * General DSH development toolkit.
 * Implements 9 tools via reversible effects, isolate realm `devkit`.
 */
import { resolveTargetUrl } from './config.js';
import { capture } from './capture.js';
import { inspect } from './inspect.js';
import { classify } from './hmr.js';
export { resolveTargetUrl };
export { capture, VIEWPORTS } from './capture.js';
export { inspect } from './inspect.js';
export { classify, hmrClassify } from './hmr.js';
export function apply(ctx, config = {}) {
    const log = ctx.logger?.('maestro-devkit') ?? { info: () => { }, warn: () => { }, error: () => { } };
    // Register tools as reversible effects
    ctx.effect(() => {
        const tools = ctx.tools;
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
        register('frontend_isolate', 'Sandbox single slot — scaffold', async () => {
            return { status: 'scaffold' };
        });
        register('devkit_cordis_inspect', 'Inspect Cordis services/events/slots — scaffold', async () => {
            return { status: 'scaffold' };
        });
        register('devkit_session', 'Inspect DSH sessions — scaffold', async () => {
            return { status: 'scaffold' };
        });
        register('devkit_govard', 'Govard wrapper — scaffold', async () => {
            return { status: 'scaffold' };
        });
        register('devkit_skills', 'Skills wrapper — scaffold', async () => {
            return { status: 'scaffold' };
        });
        register('devkit_plugin', 'Dynamic Cordis plugin lifecycle — scaffold', async () => {
            return { status: 'scaffold' };
        });
        log.info(`maestro-devkit host registered 9 tools (targetUrl=${config.targetUrl ?? 'auto'})`);
        return () => {
            for (const d of disposers)
                try {
                    d();
                }
                catch { }
        };
    });
    // Host→Client RPC (placeholder, real in Phase 1)
    ctx.effect(() => {
        const conn = ctx.connection;
        if (!conn?.rpc?.handle)
            return () => { };
        const dispose = conn.rpc.handle('/dsh-maestro-devkit', async (payload) => {
            return { echo: payload, status: 'scaffold' };
        });
        return () => { try {
            dispose?.();
        }
        catch { } };
    });
}
export default { apply };
//# sourceMappingURL=index.js.map