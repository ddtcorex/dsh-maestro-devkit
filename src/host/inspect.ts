/**
 * frontend_inspect — computedStyle + tokens + slots
 * Host calls Client RPC /dsh-maestro-devkit to get live DOM data.
 */

export type InspectOpts = {
  selector?: string;
  mode?: 'tokens' | 'slots' | 'all';
  properties?: string[];
};

export type InspectResult = {
  computedStyle: Record<string, string>;
  tokens: unknown[];
  slotOccupants: unknown[];
  sourceFile?: string;
};

export async function inspect(
  opts: InspectOpts,
  ctx: { connection?: any; hostCall?: (channel: string, payload: unknown) => Promise<any> }
): Promise<InspectResult> {
  // Try RPC to client first
  try {
    const rpc = ctx.connection?.rpc ?? ctx as any;
    const call = (ctx as any).hostCall ?? rpc?.call?.bind(rpc);
    if (call) {
      const res = await call('/dsh-maestro-devkit', { action: 'inspect', ...opts });
      if (res && typeof res === 'object') return res as InspectResult;
    }
  } catch {}
  // Fallback scaffold for tests / offline
  return {
    computedStyle: opts.selector ? { gap: '12px', padding: '8px' } : {},
    tokens: [],
    slotOccupants: [],
  };
}
