/**
 * dsh-maestro-devkit — host half
 * General DSH development toolkit.
 * Implements 9 tools via reversible effects, isolate realm `devkit`.
 */

import type { Context } from '@deepseek-ai/cordis';

export interface DevKitConfig {
  targetUrl?: string | null; // auto | local | tunnel | explicit URL
  watch?: boolean;
  verifyTunnel?: boolean;
}

export function apply(ctx: Context, config: DevKitConfig = {}) {
  const log = ctx.logger?.('maestro-devkit') ?? { info: () => {}, warn: () => {}, error: () => {} };

  // Register tools as reversible effects
  ctx.effect(() => {
    const tools = (ctx as any).tools;
    if (!tools?.register) {
      log.warn('tools registry not available, devkit tools not registered');
      return () => {};
    }

    const disposers: Array<() => void> = [];

    // Minimal placeholder tools — real implementations in writing-plans Phase 1
    const register = (name: string, description: string, handler: any) => {
      try {
        const d = tools.register({ name, description, handler } as any);
        if (typeof d === 'function') disposers.push(d);
        else if (d?.dispose) disposers.push(() => d.dispose());
      } catch (e) {
        log.warn(`failed to register ${name}: ${String(e)}`);
      }
    };

    register('frontend_capture', 'Capture DSH Web UI (3 viewports + DOM + geometry, tunnel-aware) — scaffold', async () => {
      return { status: 'scaffold', message: 'frontend_capture will be implemented in Phase 1 — see docs/specs/2026-08-28-dsh-devkit-design.md' };
    });
    register('frontend_inspect', 'Inspect computedStyle + tokens + slots — scaffold', async () => {
      return { status: 'scaffold' };
    });
    register('frontend_hmr', 'Classify HMR need and trigger — scaffold', async () => {
      return { status: 'scaffold', config };
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
      for (const d of disposers) try { d(); } catch {}
    };
  });

  // Host→Client RPC (placeholder, real in Phase 1)
  ctx.effect(() => {
    const conn = (ctx as any).connection;
    if (!conn?.rpc?.handle) return () => {};
    const dispose = conn.rpc.handle('/dsh-maestro-devkit', async (payload: unknown) => {
      return { echo: payload, status: 'scaffold' };
    });
    return () => { try { dispose?.(); } catch {} };
  });
}

export default { apply };
