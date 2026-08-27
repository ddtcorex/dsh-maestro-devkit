export async function cordisInspect(opts: { service?: string; event?: string; slot?: string }, ctx: any) {
  // Progressive discovery: without service/event/slot → directory, with → exact contract
  // For scaffold, return deterministic mock
  if (!opts.service && !opts.event && !opts.slot) {
    return { services: ['sessions','tools','skills'], events: ['agent/*'], slots: ['layout:main','shell:overlay'] };
  }
  if (opts.service) return { service: opts.service, contract: `contract for ${opts.service}` };
  if (opts.event) return { event: opts.event, contract: `contract for ${opts.event}` };
  if (opts.slot) return { slot: opts.slot, occupants: [] };
  return {};
}

export async function sessionInspect(opts: { action?: string; sessionId?: string }, ctx: any) {
  const sessions = (ctx as any).sessions ?? (ctx as any).get?.('sessions');
  if (opts.action === 'list') {
    return { sessions: sessions ? 'list via ctx.sessions' : 'no sessions service' };
  }
  return { cwd: (ctx as any).exec?.agent?.session?.header?.cwd ?? process.cwd(), sessionId: opts.sessionId };
}
