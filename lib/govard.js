import { spawn } from 'node:child_process';
export function govardCmd(cmd, opts) {
    const cwd = opts.sessionCwd ?? opts.cwd ?? process.cwd();
    return `cwd=${cwd} ${cmd}`;
}
const ALLOWLIST = {
    'make test': ['make', ['test']],
    'make build': ['make', ['build']],
    'govard env up': ['govard', ['env', 'up']],
    'govard env down': ['govard', ['env', 'down']],
    'govard sh': ['govard', ['sh']],
};
export async function govardRun(opts, ctx) {
    const entry = ALLOWLIST[opts.cmd];
    if (!entry) {
        throw new Error(`command not allowed: "${opts.cmd}" — allowed: ${Object.keys(ALLOWLIST).join(', ')}`);
    }
    const [bin, argv] = entry;
    const cwd = opts.sessionCwd ?? opts.workdir ?? ctx?.exec?.agent?.session?.header?.cwd ?? process.cwd();
    return new Promise((resolve) => {
        const proc = spawn(bin, argv, { cwd });
        let stdout = '';
        let stderr = '';
        proc.stdout?.on('data', (d) => { stdout += d.toString(); });
        proc.stderr?.on('data', (d) => { stderr += d.toString(); });
        proc.on('close', (exitCode) => {
            resolve({ cmd: opts.cmd, cwd, exitCode, stdout, stderr });
        });
    });
}
//# sourceMappingURL=govard.js.map