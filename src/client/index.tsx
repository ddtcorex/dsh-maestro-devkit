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
      try {
        if (conn?.call) return await conn.call('/dsh-maestro-devkit', { action });
        if (conn?.rpc?.call) return await conn.rpc.call('/dsh-maestro-devkit', { action });
      } catch (e) {
        console.warn('[maestro-devkit] host call failed', e);
      }
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
              onCapture: () => callHost('capture'),
              onInspect: async () => setInspected(await callHost('inspect')),
              onIsolate: () => {
                const url = `/?__devkit_sandbox=${encodeURIComponent('layout:main')}&props=${encodeURIComponent('{}')}`;
                window.open(url, '_blank');
              },
            }),
            inspected ? React.createElement(Inspector, { computedStyle: inspected.computedStyle, tokens: inspected.tokens }) : null,
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
