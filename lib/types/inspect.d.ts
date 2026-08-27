/**
 * frontend_inspect — computedStyle + tokens + slots
 * Host calls Client RPC /dsh-maestro-devkit to get live DOM data.
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
    connection?: any;
    hostCall?: (channel: string, payload: unknown) => Promise<any>;
}): Promise<InspectResult>;
//# sourceMappingURL=inspect.d.ts.map