/**
 * dsh-maestro-devkit — host half
 * General DSH development toolkit.
 * Implements 9 tools via reversible effects, isolate realm `devkit`.
 */

import type { Context } from '@deepseek-ai/cordis';
import { resolveTargetUrl } from './config.js';
import { capture } from './capture.js';
import { inspect } from './inspect.js';
import { classify, hmrClassify, startHmrWatcher } from './hmr.js';
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

export interface DevKitConfig {
  targetUrl?: string | null; // auto | local | tunnel | explicit URL
  watch?: boolean;
  verifyTunnel?: boolean;
}

export const inject = ['tools', 'connection', 'sessions'] as const

export function apply(ctx: Context, config: DevKitConfig = {}) {
  const log = ctx.logger?.('maestro-devkit') ?? { info: () => {}, warn: () => {}, error: () => {} };

  if (config.watch !== false) {
    ctx.effect(() => startHmrWatcher({ watchPaths: ['apps/web/dist', 'packages/*/src'], targetUrl: config.targetUrl ?? undefined }, ctx));
  }

  // Register tools as reversible effects
  ctx.effect(() => {
    const tools: any = (ctx as any).get?.('tools');
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

    register('frontend_capture', 'Capture DSH Web UI (3 viewports + DOM + geometry, tunnel-aware)', async (input: any) => {
      const opts = {
        targetUrl: input?.targetUrl ?? config.targetUrl ?? 'auto',
        viewport: input?.viewport ?? 'all',
        fullPage: Boolean(input?.fullPage),
        withDOM: Boolean(input?.withDOM),
        sessionId: input?.sessionId,
      };
      const result = await capture(opts as any);
      return result;
    });
    register('frontend_inspect', 'Inspect computedStyle + tokens + slots (tunnel-aware)', async (input: any) => {
      return await inspect(input ?? {}, ctx as any);
    });
    register('frontend_hmr', 'Classify HMR need and verify (tunnel double-verify; host restart delegated to supervisor dsh-safe-restart)', async (input: any) => {
      const changedFile = input?.changedFile ?? input?.file ?? '';
      const action = classify(changedFile);
      return { action, changedFile, verifyTunnel: true, config };
    });
    register('frontend_isolate', 'Sandbox single slot (isolate)', async (input: any) => {
      return await isolate(input ?? { slot: 'layout:main' }, ctx as any);
    });
    register('devkit_session', 'Inspect DSH sessions (cwd aware)', async (input: any) => {
      return await sessionInspect(input ?? {}, ctx as any);
    });
    register('devkit_govard', 'Govard wrapper (session cwd aware)', async (input: any) => {
      return await govardRun(input ?? { cmd: 'make test' }, ctx as any);
    });
    register('devkit_skills', 'Skills wrapper (list/scaffold)', async (input: any) => {
      return await skillsAction(input ?? { action: 'list' }, ctx as any);
    });

    log.info(`maestro-devkit host registered 7 tools (targetUrl=${config.targetUrl ?? 'auto'})`);

    return () => {
      for (const d of disposers) try { d(); } catch {}
    };
  });

  // Host→Client RPC for floating bar
  ctx.effect(() => {
    const conn: any = (ctx as any).get?.('connection');
    if (!conn?.rpc?.handle) return () => {};
    const dispose = conn.rpc.handle(
      '/dsh-maestro-devkit',
      async (payload: any) => {
        const action = payload?.action;
        if (action === 'capture') {
          return await capture({ targetUrl: config.targetUrl ?? 'auto' } as any);
        }
        if (action === 'inspect') {
          return await inspect(payload ?? {}, ctx as any);
        }
        return { echo: payload, status: 'ok' };
      },
      { authority: 'loopback' },
    );
    return () => { try { dispose?.(); } catch {} };
  });
}

export default { apply };
