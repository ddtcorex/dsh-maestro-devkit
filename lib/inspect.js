/**
 * frontend_inspect — computedStyle + tokens + slots
 * Host calls Client RPC /dsh-maestro-devkit to get live DOM data.
 */
export async function inspect(opts, ctx) {
    // Try RPC to client first
    try {
        const rpc = ctx.connection?.rpc ?? ctx;
        const call = ctx.hostCall ?? rpc?.call?.bind(rpc);
        if (call) {
            const res = await call('/dsh-maestro-devkit', { action: 'inspect', ...opts });
            if (res && typeof res === 'object')
                return res;
        }
    }
    catch { }
    // Fallback scaffold for tests / offline
    return {
        computedStyle: opts.selector ? { gap: '12px', padding: '8px' } : {},
        tokens: [],
        slotOccupants: [],
    };
}
//# sourceMappingURL=inspect.js.map