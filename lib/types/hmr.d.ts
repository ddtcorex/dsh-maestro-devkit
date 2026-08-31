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
 * build:client/host-restart is intentionally out of scope here: devkit is
 * a consumer only. Host restarts belong to the supervisor-owned
 * `dsh-safe-restart` skill (`<workspace-root>/packages/dsh-maestro-supervisor/
 * skills/dsh-safe-restart/SKILL.md`) and its in-session `dsh_web_restart`
 * tool; devkit must never instruct or execute its own restart. This watcher
 * classifies + verifies + logs, giving the developer the same signal
 * frontend_hmr's tool call does.
 */
export declare function startHmrWatcher(opts: {
    watchPaths: string[];
    targetUrl?: string;
}, ctx: any): () => void;
//# sourceMappingURL=hmr.d.ts.map