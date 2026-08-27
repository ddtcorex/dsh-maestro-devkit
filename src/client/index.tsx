import * as React from 'react';
import { OverlayToolbar } from './overlay.js';

/**
 * dsh-maestro-devkit — client half
 * Overlay + inspector + sandbox slots.
 * Uses ctx.get('slots') pattern (no direct ctx.slots) to avoid
 * "cannot get property slots without inject" when inject metadata is
 * not yet propagated. Safe early-return if slots unavailable.
 */

export function apply(ctx: any) {
  ctx.effect(() => {
    const slots = (ctx as any).get?.('slots') as { inject?: (name: string, factory: () => unknown) => () => void } | undefined;
    if (!slots?.inject) return () => {};
    const dispose = slots.inject('shell:overlay', () => React.createElement(OverlayToolbar, {}));
    return () => {
      try { dispose?.(); } catch {}
    };
  });

  // Ensure client bundle is not empty
  ctx.effect(() => {
    return () => {};
  });
}

export default { apply };
