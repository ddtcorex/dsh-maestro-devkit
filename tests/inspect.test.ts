import { describe, it, expect, vi } from 'vitest';
import { inspect } from '../src/host/inspect.js';

describe('frontend_inspect', () => {
  it('calls the client RPC channel, not the host self-channel', async () => {
    const call = vi.fn(async () => ({ computedStyle: { gap: '12px' }, tokens: [], slotOccupants: [] }));
    const ctx = { connection: { rpc: { call } } };
    await inspect({ selector: '[class*=header]' }, ctx);
    expect(call).toHaveBeenCalledWith('/dsh-maestro-devkit-client', expect.objectContaining({ selector: '[class*=header]' }));
    expect(call).not.toHaveBeenCalledWith('/dsh-maestro-devkit', expect.anything());
  });

  it('returns the real computedStyle from the client channel', async () => {
    const ctx = { connection: { rpc: { call: async () => ({ computedStyle: { gap: '12px' }, tokens: [], slotOccupants: [] }) } } };
    const r = await inspect({ selector: '[class*=header]' }, ctx);
    expect(r.computedStyle.gap).toBe('12px');
  });

  it('fallback returns scaffold shape when no connection is available', async () => {
    const r = await inspect({ selector: '[class*=header]' }, {});
    expect(r.computedStyle).toBeDefined();
    expect(r.tokens).toEqual([]);
    expect(r.slotOccupants).toEqual([]);
  });

  it('tokens mode returns tokens array from the client channel', async () => {
    const ctx = { connection: { rpc: { call: async () => ({ computedStyle: {}, tokens: [{ name: '--dsh-color-bg' }], slotOccupants: [] }) } } };
    const r = await inspect({ mode: 'tokens' }, ctx);
    expect(r.tokens.length).toBe(1);
  });
});
