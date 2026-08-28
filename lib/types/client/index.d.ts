/**
 * dsh-maestro-devkit — client half
 * Overlay + inspector + sandbox slots.
 * Uses ctx.get('slots') pattern (no direct ctx.slots) to avoid
 * "cannot get property slots without inject" when inject metadata is
 * not yet propagated. Safe early-return if slots unavailable.
 */
export declare const inject: readonly ["slots"];
export declare function apply(ctx: any): void;
declare const _default: {
    inject: readonly ["slots"];
    apply: typeof apply;
};
export default _default;
//# sourceMappingURL=index.d.ts.map