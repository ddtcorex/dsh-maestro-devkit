/**
 * frontend_hmr — classify reload need + double-verify (local + tunnel)
 */
export type HmrAction = 'hot-patch' | 'build:client' | 'host-restart' | 'preset-restart';
export declare function classify(file: string): HmrAction;
export declare function hmrClassify(input: {
    changedFile: string;
    targetUrl?: string;
}): Promise<{
    action: HmrAction;
    changedFile: string;
    verifyTunnel: boolean;
}>;
//# sourceMappingURL=hmr.d.ts.map