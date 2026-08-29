export async function sessionInspect(opts, ctx) {
    const sessions = ctx.get?.('sessions');
    if (opts.action === 'list') {
        if (!sessions?.list)
            return { sessions: [] };
        const list = Array.from(sessions.list()).map((s) => ({
            id: s.header?.id,
            cwd: s.header?.cwd,
        }));
        return { sessions: list };
    }
    const session = opts.sessionId && sessions?.get ? sessions.get(opts.sessionId) : undefined;
    return {
        cwd: session?.header?.cwd ?? process.cwd(),
        sessionId: opts.sessionId,
    };
}
//# sourceMappingURL=cordis.js.map