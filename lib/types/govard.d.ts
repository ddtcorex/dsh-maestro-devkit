export declare function govardCmd(cmd: string, opts: {
    sessionCwd?: string;
    cwd?: string;
}): string;
export declare function govardRun(opts: {
    cmd: string;
    workdir?: string;
    sessionCwd?: string;
}, ctx: any): Promise<{
    cmd: string;
    cwd: string;
    exitCode: number | null;
    stdout: string;
    stderr: string;
}>;
//# sourceMappingURL=govard.d.ts.map