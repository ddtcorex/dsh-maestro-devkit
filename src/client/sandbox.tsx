import * as React from 'react';

export function Sandbox({ slot, props }: { slot: string; props?: any }) {
  return React.createElement('div', { style: { padding: 16, border: '1px dashed #ccc', borderRadius: 8 } },
    React.createElement('div', { style: { fontWeight: 700 } }, `Sandbox: ${slot}`),
    React.createElement('pre', { style: { fontSize: '0.85em', background: '#f5f5f5', padding: 8 } }, JSON.stringify(props ?? {}, null, 2))
  );
}

export function SandboxContainer() {
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const slot = params.get('slot') ?? 'layout:main';
  const propsStr = params.get('props');
  let props: any = {};
  try { props = propsStr ? JSON.parse(propsStr) : {}; } catch {}
  return React.createElement(Sandbox, { slot, props });
}
