import { describe, it, expect } from 'vitest';
import { apply as hostApply, inject as hostInject } from '../src/host/index.js';
import { apply as clientApply, inject as clientInject } from '../src/client/index.js';

function createMockContext(allowed: readonly string[], impls: Record<string, any> = {}) {
  const base: any = {
    effect: (fn: () => void | (() => void)) => fn(),
    logger: () => ({ info() {}, warn() {}, error() {} }),
  };
  return new Proxy(base, {
    get(target, prop: string) {
      if (prop in target) return target[prop];
      if (prop === 'get') {
        return (name: string) => (allowed.includes(name) ? (impls[name] ?? {}) : undefined);
      }
      if (!allowed.includes(prop)) {
        throw new Error(`cannot get property "${String(prop)}" without inject`);
      }
      return impls[prop] ?? {};
    },
  });
}

describe('safe ctx access (regression: 2026-08-28 slots-fix incident)', () => {
  it('host apply() does not throw when scoped to exactly its declared inject', () => {
    const ctx = createMockContext(hostInject, {
      tools: { register: () => () => {} },
      connection: { rpc: { handle: () => () => {} } },
    });
    expect(() => hostApply(ctx as any, {})).not.toThrow();
  });

  it('client apply() does not throw when scoped to exactly its declared inject', () => {
    const ctx = createMockContext(clientInject, {
      slots: { inject: () => () => {}, register: () => {} },
      connection: { call: async () => ({}) },
    });
    expect(() => clientApply(ctx as any)).not.toThrow();
  });

  it('client apply() does not throw even when slots is unavailable (early-return guard)', () => {
    const ctx = createMockContext(clientInject, {});
    expect(() => clientApply(ctx as any)).not.toThrow();
  });
});
