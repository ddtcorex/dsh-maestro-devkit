export declare function isolateUrl(opts: {
    slot: string;
    props?: any;
}): string;
export declare function isolate(opts: {
    slot: string;
    props?: any;
    viewport?: string;
}, ctx?: any): Promise<{
    sandboxUrl: string;
    slot: string;
    props: any;
}>;
//# sourceMappingURL=isolate.d.ts.map