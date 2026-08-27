/**
 * dsh-maestro-devkit — host half
 * General DSH development toolkit.
 * Implements 9 tools via reversible effects, isolate realm `devkit`.
 */
import type { Context } from '@deepseek-ai/cordis';
export interface DevKitConfig {
    targetUrl?: string | null;
    watch?: boolean;
    verifyTunnel?: boolean;
}
export declare function apply(ctx: Context, config?: DevKitConfig): void;
declare const _default: {
    apply: typeof apply;
};
export default _default;
//# sourceMappingURL=index.d.ts.map