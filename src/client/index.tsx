import * as React from 'react';
import { OverlayToolbar } from './overlay.js';

/**
 * dsh-maestro-devkit — client half
 * Overlay + inspector + sandbox slots.
 * Uses ctx.get('slots') pattern (no direct ctx.slots) to avoid
 * "cannot get property slots without inject" when inject metadata is
 * not yet propagated. Safe early-return if slots unavailable.
 */

export const inject = ['slots', 'host'] as const;

export function apply(ctx: any) {
  ctx.effect(() => {
    const slots: any = (ctx as any).slots ?? (ctx as any).get?.('slots');
    const host: any = (ctx as any).host ?? (ctx as any).get?.('host');
    if (!slots?.inject || !slots?.register) return () => {};
    const callHost = async (action: string) => {
      try {
        let res: any;
        if (action === 'capture' && host?.call) res = await host.call('devkit.capture', {});
        else if (action === 'inspect' && host?.call) res = await host.call('devkit.inspect', {});
        else {
          const conn: any = (ctx as any).get?.('connection');
          if (conn?.call) res = await conn.call('/dsh-maestro-devkit', { action });
        }
        console.log(`[maestro-devkit] ${action} result`, res);
        try {
          // lightweight feedback — toast via alert if available
          if (typeof window !== 'undefined' && (window as any).alert) {
            const summary = res ? JSON.stringify(res).slice(0, 400) : action + ' done';
            (window as any).alert(`${action}: ${summary}`);
          }
        } catch {}
        return res;
      } catch (e) {
        console.warn('[maestro-devkit] host call failed', e);
        try { (window as any).alert(`${action} failed: ${String(e)}`); } catch {}
      }
    };
    const dispose = slots.inject('shell.overlay', () =>
      slots.register(
        { name: 'shell.overlay', id: 'maestro-devkit-overlay', order: 100 },
        () =>
          React.createElement(OverlayToolbar, {
            onCapture: () => callHost('capture'),
            onInspect: () => callHost('inspect'),
          }),
      ),
    );
    return () => {
      try {
        dispose?.();
      } catch {}
    };
  });

  // Ensure client bundle is not empty
  ctx.effect(() => {
    return () => {};
  });
}

export default { inject, apply };
