export declare function sessionInspect(opts: {
    action?: string;
    sessionId?: string;
}, ctx: any): Promise<{
    sessions: {
        id: any;
        cwd: any;
    }[];
    cwd?: undefined;
    sessionId?: undefined;
} | {
    cwd: any;
    sessionId: string | undefined;
    sessions?: undefined;
}>;
//# sourceMappingURL=cordis.d.ts.map