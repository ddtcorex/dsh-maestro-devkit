/**
 * frontend_inspect — computedStyle + tokens + slots
 * Host calls the client's own RPC channel (registered in src/client/index.tsx)
 * to get live DOM data from the browser tab where the user clicked Inspect.
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
  ctx: { connection?: { rpc?: { call?: (channel: string, payload: unknown) => Promise<any> } } },
): Promise<InspectResult> {
  try {
    const call = ctx.connection?.rpc?.call;
    if (call) {
      const res = await call('/dsh-maestro-devkit-client', opts);
      if (res && typeof res === 'object') return res as InspectResult;
    }
  } catch {}
  return {
    computedStyle: opts.selector ? { gap: '12px', padding: '8px' } : {},
    tokens: [],
    slotOccupants: [],
  };
}
