export async function pluginAction(opts, ctx) {
    if (opts.action === 'define')
        return { pluginId: 'devkit-dynamic', packageId: 'pkg-1', status: 'defined' };
    if (opts.action === 'run')
        return { pluginId: opts.code, status: 'running' };
    return { action: opts.action, status: 'scaffold' };
}
//# sourceMappingURL=plugin.js.map