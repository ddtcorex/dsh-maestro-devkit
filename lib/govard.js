export function govardCmd(cmd, opts) {
    const cwd = opts.sessionCwd ?? opts.cwd ?? process.cwd();
    return `cwd=${cwd} ${cmd}`;
}
export async function govardRun(opts, ctx) {
    const cwd = opts.sessionCwd ?? opts.workdir ?? ctx.exec?.agent?.session?.header?.cwd ?? process.cwd();
    return { cmd: opts.cmd, cwd, note: 'govard wrapper — scaffold, real govard_shell in Phase 1 full' };
}
//# sourceMappingURL=govard.js.map