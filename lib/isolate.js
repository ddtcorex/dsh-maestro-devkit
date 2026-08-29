export function isolateUrl(opts) {
    const q = encodeURIComponent(JSON.stringify(opts.props ?? {}));
    return `/?__devkit_sandbox=${encodeURIComponent(opts.slot)}&props=${q}`;
}
export async function isolate(opts, ctx) {
    return { sandboxUrl: isolateUrl(opts), slot: opts.slot, props: opts.props ?? {} };
}
//# sourceMappingURL=isolate.js.map