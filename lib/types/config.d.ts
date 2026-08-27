/**
 * Resolve target URL for frontend capture/HMR.
 * - env DSH_FRONTEND_URL wins
 * - explicit string passthrough (not auto/local/tunnel)
 * - local → http://127.0.0.1:3080
 * - tunnel/auto → try ~/.dsh/maestro/settings.json remote.tunnelUrl else local
 */
export declare function resolveTargetUrl(input?: string | null): Promise<string>;
//# sourceMappingURL=config.d.ts.map