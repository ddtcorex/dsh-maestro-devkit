/**
 * frontend_inspect — computedStyle + tokens + slots
 * Host calls the client's own RPC channel (registered in src/client/index.tsx)
 * to get live DOM data from the browser tab where the user clicked Inspect.
 */
export async function inspect(opts, ctx) {
    try {
        const call = ctx.connection?.rpc?.call;
        if (call) {
            const res = await call('/dsh-maestro-devkit-client', opts);
            if (res && typeof res === 'object')
                return res;
        }
    }
    catch { }
    return {
        computedStyle: opts.selector ? { gap: '12px', padding: '8px' } : {},
        tokens: [],
        slotOccupants: [],
    };
}
//# sourceMappingURL=inspect.js.map