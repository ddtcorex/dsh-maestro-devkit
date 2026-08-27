export function govardCmd(cmd: string, opts: { sessionCwd?: string; cwd?: string }): string {
  const cwd = opts.sessionCwd ?? opts.cwd ?? process.cwd();
  return `cwd=${cwd} ${cmd}`;
}

export async function govardRun(opts: { cmd: string; workdir?: string; sessionCwd?: string }, ctx: any) {
  const cwd = opts.sessionCwd ?? opts.workdir ?? (ctx as any).exec?.agent?.session?.header?.cwd ?? process.cwd();
  return { cmd: opts.cmd, cwd, note: 'govard wrapper — scaffold, real govard_shell in Phase 1 full' };
}
