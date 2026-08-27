import * as React from 'react';

export function Inspector({ computedStyle, tokens }: { computedStyle?: Record<string, string>; tokens?: unknown[] }) {
  return React.createElement('div', { style: { padding: 12, background: '#fafafa', border: '1px solid #eee', borderRadius: 8 } },
    React.createElement('div', null, `gap: ${computedStyle?.gap ?? '—'}`),
    React.createElement('div', null, `tokens: ${tokens?.length ?? 0}`)
  );
}
