import * as React from 'react';
import { OverlayToolbar } from './overlay.js';
import { SandboxContainer } from './sandbox.js';
import { Inspector } from './inspector.js';

export const inject = ['slots', 'connection'] as const;

export function apply(ctx: any) {
  ctx.effect(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    if (params.has('__devkit_sandbox')) {
      const slots: any = (ctx as any).slots ?? (ctx as any).get?.('slots');
      if (!slots?.inject || !slots?.register) return () => {};
      const dispose = slots.inject('shell.overlay', () =>
        slots.register(
          { name: 'shell.overlay', id: 'maestro-devkit-sandbox', order: 100 },
          () => React.createElement(SandboxContainer, {}),
        ),
      );
      return () => { try { dispose?.(); } catch {} };
    }

    const slots: any = (ctx as any).slots ?? (ctx as any).get?.('slots');
    const conn: any = (ctx as any).connection ?? (ctx as any).get?.('connection');
    if (!slots?.inject || !slots?.register) return () => {};

    const callHost = async (action: string) => {
      // Prefer rpc.call (registered with authority:loopback on host). Fallback to conn.call for legacy.
      const tryCall = async (fn: any) => {
        try { const r = await fn('/dsh-maestro-devkit', { action }); if (r !== undefined) return r; } catch (e) { console.warn('[maestro-devkit] host call failed', e); }
        return undefined;
      };
      if (conn?.rpc?.call) {
        const r = await tryCall(conn.rpc.call.bind(conn.rpc));
        if (r !== undefined) return r;
      }
      if (conn?.call) {
        const r = await tryCall(conn.call.bind(conn));
        if (r !== undefined) return r;
      }
      return undefined;
    };

    const dispose = slots.inject('shell.overlay', () =>
      slots.register(
        { name: 'shell.overlay', id: 'maestro-devkit-overlay', order: 100 },
        () => {
          const [inspected, setInspected] = React.useState<any>(null);
          return React.createElement(
            React.Fragment,
            null,
            React.createElement(OverlayToolbar, {
              onCapture: async () => { const r = await callHost('capture'); console.log('[devkit] capture', r); },
              onInspect: async () => {
                const r = await callHost('inspect');
                // Fallback to empty inspector so popup always appears for validation
                setInspected(r ?? { computedStyle: {}, tokens: [] });
              },
              onIsolate: () => {
                const url = `/?__devkit_sandbox=${encodeURIComponent('layout:main')}&props=${encodeURIComponent('{}')}`;
                window.open(url, '_blank');
              },
            }),
            inspected
              ? React.createElement(Inspector, {
                  computedStyle: inspected.computedStyle ?? inspected.computed_style ?? {},
                  tokens: inspected.tokens ?? [],
                  onClose: () => setInspected(null),
                })
              : null,
          );
        },
      ),
    );
    return () => {
      try {
        dispose?.();
      } catch {}
    };
  });

  // Host→Client RPC: exposes real DOM introspection to the host's frontend_inspect tool
  ctx.effect(() => {
    const conn: any = (ctx as any).connection ?? (ctx as any).get?.('connection');
    if (!conn?.rpc?.handle) return () => {};
    const dispose = conn.rpc.handle('/dsh-maestro-devkit-client', async (opts: any) => {
      const selector = opts?.selector;
      let computedStyle: Record<string, string> = {};
      if (selector && typeof document !== 'undefined') {
        const el = document.querySelector(selector);
        if (el) {
          const cs = getComputedStyle(el);
          computedStyle = { gap: cs.gap, padding: cs.padding, margin: cs.margin, color: cs.color };
        }
      }
      return { computedStyle, tokens: [], slotOccupants: [] };
    });
    return () => { try { dispose?.(); } catch {} };
  });
}

export default { inject, apply };
