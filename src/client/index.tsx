import * as React from 'react';
import { OverlayToolbar } from './overlay.js';

/**
 * dsh-maestro-devkit — client half
 * Overlay + inspector + sandbox slots.
 */

export function apply(ctx: any) {
  ctx.effect(() => {
    const slots = ctx.slots;
    if (!slots?.inject) return () => {};
    const dispose = slots.inject('shell:overlay', () => React.createElement(OverlayToolbar, {}));
    return () => { try { dispose?.(); } catch {} };
  });

  // Example: expose a simple status component for verification
  ctx.effect(() => {
    // No-op for scaffold — ensures client bundle is not empty
    return () => {};
  });
}

export default { apply };
