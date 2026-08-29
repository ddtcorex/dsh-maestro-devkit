/**
 * frontend_inspect — computedStyle + tokens + slots
 * Host calls the client's own RPC channel (registered in src/client/index.tsx)
 * to get live DOM data from the browser tab where the user clicked Inspect.
 */
export type InspectOpts = {
    selector?: string;
    mode?: 'tokens' | 'slots' | 'all';
    properties?: string[];
};
export type InspectResult = {
    computedStyle: Record<string, string>;
    tokens: unknown[];
    slotOccupants: unknown[];
    sourceFile?: string;
};
export declare function inspect(opts: InspectOpts, ctx: {
    connection?: {
        rpc?: {
            call?: (channel: string, payload: unknown) => Promise<any>;
        };
    };
}): Promise<InspectResult>;
//# sourceMappingURL=inspect.d.ts.map