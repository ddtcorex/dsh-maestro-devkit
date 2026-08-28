import * as React from 'react';
import { OverlayToolbar } from './overlay.js';

/**
 * dsh-maestro-devkit — client half
 * Overlay + inspector + sandbox slots.
 * Uses ctx.get('slots') pattern (no direct ctx.slots) to avoid
 * "cannot get property slots without inject" when inject metadata is
 * not yet propagated. Safe early-return if slots unavailable.
 */

export const inject = ['slots'] as const;

export function apply(ctx: any) {
  ctx.effect(() => {
    const slots: any = (ctx as any).slots ?? (ctx as any).get?.('slots');
    if (!slots?.inject || !slots?.register) return () => {};
    const dispose = slots.inject('shell.overlay', () =>
      slots.register(
        { name: 'shell.overlay', id: 'maestro-devkit-overlay', order: 100 },
        () => React.createElement(OverlayToolbar, {}),
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
