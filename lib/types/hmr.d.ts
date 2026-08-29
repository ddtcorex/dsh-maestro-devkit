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
/**
 * Start a reversible chokidar watcher. On a matched change, classify the
 * action and verify the target URL responds — actually triggering
 * build:client/host-restart is intentionally out of MVP scope here (that
 * would call into dsh-safe-web-update's consent-gated restart flow, which
 * must not be automated silently); this watcher classifies + verifies +
 * logs, giving the developer the same signal frontend_hmr's tool call does.
 */
export declare function startHmrWatcher(opts: {
    watchPaths: string[];
    targetUrl?: string;
}, ctx: any): () => void;
//# sourceMappingURL=hmr.d.ts.map