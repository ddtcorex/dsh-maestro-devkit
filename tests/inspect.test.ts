import { describe, it, expect, vi } from 'vitest';
import { inspect } from '../src/host/inspect.js';

describe('frontend_inspect', () => {
  it('returns computedStyle filtered for gap/padding', async () => {
    const mockCall = vi.fn(async () => ({ computedStyle: { gap: '12px' }, tokens: [], slotOccupants: [] }));
    const r = await inspect({ selector: '[class*=header]' }, { hostCall: mockCall } as any);
    expect(r.computedStyle.gap).toBe('12px');
    expect(mockCall).toHaveBeenCalledWith('/dsh-maestro-devkit', expect.objectContaining({ selector: '[class*=header]' }));
  });

  it('fallback returns scaffold when no RPC', async () => {
    const r = await inspect({ selector: '[class*=header]' }, {} as any);
    expect(r.computedStyle).toBeDefined();
  });

  it('tokens mode returns tokens array', async () => {
    const r = await inspect({ mode: 'tokens' }, { hostCall: async () => ({ computedStyle: {}, tokens: [{ name: '--dsh-color-bg' }], slotOccupants: [] }) } as any);
    expect(r.tokens.length).toBe(1);
  });
});
