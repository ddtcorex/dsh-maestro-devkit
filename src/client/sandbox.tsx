import * as React from 'react';

const STYLE_ID = 'maestro-devkit-sandbox-style';
const STYLE_CSS = `
.mdk-sandbox{
  padding:16px;
  background:var(--dsw-alias-bg-base);
  border:1px solid var(--dsw-alias-border-l2);
  border-radius:12px;
  box-shadow:var(--dsw-shadow-lv1, 0 2px 4px rgba(0,0,0,0.05));
  color:var(--dsw-alias-label-primary);
  font:var(--dsw-font-s-14, 14px/22px var(--dsw-font-family));
  max-width:720px;
  margin:24px auto;
}
.mdk-sandbox h2{ margin:0 0 12px; font:var(--dsw-font-m-18, 500 16px/28px var(--dsw-font-family)); color:var(--dsw-alias-label-primary); }
.mdk-sandbox textarea{
  width:100%; min-height:160px;
  font-family:var(--ds-font-family-code); font-size:12px; line-height:18px;
  padding:10px 12px;
  border-radius:8px;
  border:1px solid var(--dsw-alias-border-l2);
  background:var(--dsw-specific-input-major, var(--dsw-alias-bg-base));
  color:var(--dsw-alias-label-primary);
  resize:vertical;
}
.mdk-sandbox textarea:focus{ outline:2px solid var(--dsw-alias-state-business-primary); outline-offset:0; border-color:transparent; }
.mdk-sandbox .mdk-btn{
  display:inline-flex; align-items:center; justify-content:center;
  height:36px; padding:0 16px; border-radius:999px;
  border:1px solid var(--dsw-alias-border-l2);
  background:var(--dsw-alias-button-primary-fill);
  color:var(--dsw-alias-label-primary-foreground);
  cursor:pointer;
  font:var(--dsw-font-s-14);
}
.mdk-sandbox .mdk-btn:hover{ background:var(--dsw-alias-button-primary-hover); }
.mdk-sandbox .mdk-btn:focus-visible{ outline:2px solid var(--dsw-alias-state-business-primary); outline-offset:2px; }
.mdk-error{ color:var(--dsw-alias-state-error-primary); margin-top:8px; font:var(--dsw-font-xs-13); }
@media (max-width: 768px){
  .mdk-sandbox{ margin:12px; padding:12px; border-radius:16px; }
  .mdk-sandbox textarea{ min-height:200px; font-size:13px; }
  .mdk-sandbox .mdk-btn{ height:44px; width:100%; }
}
`;

function ensureStyle() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = STYLE_CSS;
  document.head.appendChild(el);
}

export function Sandbox({
  slot,
  props,
  onPropsChange,
}: {
  slot: string;
  props?: any;
  onPropsChange?: (next: any) => void;
}) {
  ensureStyle();
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
    { className: 'mdk-sandbox' },
    React.createElement('h2', null, `Sandbox: ${slot}`),
    React.createElement('textarea', {
      value: text,
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value),
      'aria-label': 'Sandbox props JSON',
      spellCheck: false,
    }),
    React.createElement('div', { style: { marginTop: 12 } },
      React.createElement('button', { onClick: handleRerender, className: 'mdk-btn', type: 'button' as const }, 'Re-render'),
    ),
    error ? React.createElement('div', { className: 'mdk-error', role: 'alert' }, error) : null,
  );
}

export function SandboxContainer() {
  ensureStyle();
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const slot = params.get('__devkit_sandbox') ?? 'layout:main';
  const propsStr = params.get('props');
  let initialProps: any = {};
  try { initialProps = propsStr ? JSON.parse(propsStr) : {}; } catch {}
  const [props, setProps] = React.useState(initialProps);
  return React.createElement(Sandbox, { slot, props, onPropsChange: setProps });
}
