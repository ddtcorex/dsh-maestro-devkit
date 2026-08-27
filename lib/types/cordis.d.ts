export declare function cordisInspect(opts: {
    service?: string;
    event?: string;
    slot?: string;
}, ctx: any): Promise<{
    services: string[];
    events: string[];
    slots: string[];
    service?: undefined;
    contract?: undefined;
    event?: undefined;
    slot?: undefined;
    occupants?: undefined;
} | {
    service: string;
    contract: string;
    services?: undefined;
    events?: undefined;
    slots?: undefined;
    event?: undefined;
    slot?: undefined;
    occupants?: undefined;
} | {
    event: string;
    contract: string;
    services?: undefined;
    events?: undefined;
    slots?: undefined;
    service?: undefined;
    slot?: undefined;
    occupants?: undefined;
} | {
    slot: string;
    occupants: never[];
    services?: undefined;
    events?: undefined;
    slots?: undefined;
    service?: undefined;
    contract?: undefined;
    event?: undefined;
} | {
    services?: undefined;
    events?: undefined;
    slots?: undefined;
    service?: undefined;
    contract?: undefined;
    event?: undefined;
    slot?: undefined;
    occupants?: undefined;
}>;
export declare function sessionInspect(opts: {
    action?: string;
    sessionId?: string;
}, ctx: any): Promise<{
    sessions: string;
    cwd?: undefined;
    sessionId?: undefined;
} | {
    cwd: any;
    sessionId: string | undefined;
    sessions?: undefined;
}>;
//# sourceMappingURL=cordis.d.ts.map