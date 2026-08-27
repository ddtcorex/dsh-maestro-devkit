export declare function pluginAction(opts: {
    action: string;
    code?: string;
}, ctx: any): Promise<{
    pluginId: string;
    packageId: string;
    status: string;
    action?: undefined;
} | {
    pluginId: string | undefined;
    status: string;
    packageId?: undefined;
    action?: undefined;
} | {
    action: string;
    status: string;
    pluginId?: undefined;
    packageId?: undefined;
}>;
//# sourceMappingURL=plugin.d.ts.map