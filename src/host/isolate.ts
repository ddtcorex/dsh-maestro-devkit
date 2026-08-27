export function isolateUrl(opts: { slot: string; props?: any }): string {
  const q = encodeURIComponent(JSON.stringify(opts.props ?? {}));
  return `/__frontend_sandbox?slot=${encodeURIComponent(opts.slot)}&props=${q}`;
}

export async function isolate(opts: { slot: string; props?: any; viewport?: string }, ctx?: any) {
  return { sandboxUrl: isolateUrl(opts), slot: opts.slot, props: opts.props ?? {} };
}
