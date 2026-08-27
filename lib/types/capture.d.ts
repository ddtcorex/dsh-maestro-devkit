export declare const VIEWPORTS: Record<string, {
    width: number;
    height: number;
    deviceScaleFactor: number;
    mobile: boolean;
    hasTouch: boolean;
}>;
export type CaptureOpts = {
    targetUrl?: string | null;
    viewport?: string | null;
    fullPage?: boolean;
    withDOM?: boolean;
    sessionId?: string;
};
export type CaptureResult = {
    screenshots: Record<string, string>;
    domSnapshotPath: string | null;
    geometry: Record<string, any>;
    consoleMessages: any[];
    url: string;
    viewports: string[];
};
type CaptureDeps = {
    send?: (method: string, params?: any) => Promise<any>;
    fetchFn?: (url: string, init?: any) => Promise<any>;
    WebSocketCtor?: any;
    port?: number;
    tmpDir?: string;
};
/**
 * frontend_capture — CDP capture 3 viewports + DOM + geometry, tunnel-aware.
 * Mandatory: fresh user-data-dir, Page.addScriptToEvaluateOnNewDocument inject,
 * Emulation.setDeviceMetricsOverride, Page.navigate(targetUrl), clip scale:1, cleanup.
 */
export declare function capture(opts: CaptureOpts, depsOverrides?: Partial<CaptureDeps>): Promise<CaptureResult>;
declare const _default: {
    capture: typeof capture;
    VIEWPORTS: Record<string, {
        width: number;
        height: number;
        deviceScaleFactor: number;
        mobile: boolean;
        hasTouch: boolean;
    }>;
};
export default _default;
//# sourceMappingURL=capture.d.ts.map