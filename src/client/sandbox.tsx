import * as React from 'react';

export function Sandbox({
  slot,
  props,
  onPropsChange,
}: {
  slot: string;
  props?: any;
  onPropsChange?: (next: any) => void;
}) {
  const [text, setText] = React.useState(() => JSON.stringify(props ?? {}, null, 2));
  const [error, setError] = React.useState<string | null>(null);

  const handleRerender = () => {
    try {
      const parsed = JSON.parse(text);
      setError(null);
      onPropsChange?.(parsed);
    } catch {
      setError('Invalid JSON — fix the syntax and try again.');
    }
  };

  return React.createElement(
    'div',
    { style: { padding: 16, border: '1px dashed #ccc', borderRadius: 8 } },
    React.createElement('div', { style: { fontWeight: 700 } }, `Sandbox: ${slot}`),
    React.createElement('textarea', {
      value: text,
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value),
      style: { width: '100%', minHeight: 160, fontFamily: 'monospace', fontSize: '0.85em', marginTop: 8 },
    }),
    React.createElement('button', { onClick: handleRerender, style: { marginTop: 8 } }, 'Re-render'),
    error ? React.createElement('div', { style: { color: 'crimson', marginTop: 4 } }, error) : null,
  );
}

export function SandboxContainer() {
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const slot = params.get('__devkit_sandbox') ?? 'layout:main';
  const propsStr = params.get('props');
  let initialProps: any = {};
  try { initialProps = propsStr ? JSON.parse(propsStr) : {}; } catch {}
  const [props, setProps] = React.useState(initialProps);
  return React.createElement(Sandbox, { slot, props, onPropsChange: setProps });
}
