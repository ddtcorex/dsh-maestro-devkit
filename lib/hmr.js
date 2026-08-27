/**
 * frontend_hmr — classify reload need + double-verify (local + tunnel)
 */
export function classify(file) {
    if (file.includes('apps/web/dist/'))
        return 'hot-patch';
    if (file.includes('src/client') || file.endsWith('.css.ts') || file.includes('src/client/'))
        return 'build:client';
    if (file.includes('src/host') || file.includes('cordis.patch.yml') || file.includes('package.json'))
        return 'host-restart';
    if (file.includes('.agent-presets') || file.includes('.dsh/.agent-presets'))
        return 'preset-restart';
    // fallback: client-ish files
    if (file.match(/\.(tsx|ts|css)$/) && file.includes('client'))
        return 'build:client';
    return 'hot-patch';
}
export async function hmrClassify(input) {
    const action = classify(input.changedFile);
    return { action, changedFile: input.changedFile, verifyTunnel: true };
}
//# sourceMappingURL=hmr.js.map