import * as React from 'react';

const STYLE_ID = 'maestro-devkit-inspector-style';
const STYLE_CSS = `
.mdk-drawer{
  position:fixed;
  z-index:9998;
  right:12px;
  top:132px;
  width:360px;
  max-width:calc(100vw - 24px);
  max-height:calc(100vh - 160px);
  overflow:auto;
  background:var(--dsw-alias-bg-base);
  border:1px solid var(--dsw-alias-border-l2);
  border-radius:12px;
  box-shadow:var(--dsw-shadow-lv3, 0 8px 32px rgba(0,0,0,0.12));
  color:var(--dsw-alias-label-primary);
  font:var(--dsw-font-s-14, 14px/22px var(--dsw-font-family));
}
.mdk-drawer-header{
  position:sticky; top:0;
  display:flex; align-items:center; justify-content:space-between;
  padding:10px 12px;
  background:var(--dsw-alias-bg-base);
  border-bottom:1px solid var(--dsw-alias-border-l2);
  font:var(--dsw-font-s-strong-14, 500 14px/22px var(--dsw-font-family));
}
.mdk-drawer-close{
  display:inline-flex; align-items:center; justify-content:center;
  width:26px; height:26px; border-radius:999px;
  border:1px solid var(--dsw-alias-border-l2);
  background:var(--dsw-alias-bg-base);
  color:var(--dsw-alias-label-secondary);
  cursor:pointer;
}
.mdk-drawer-close:hover{ background:var(--dsw-alias-interactive-bg-hover); }
.mdk-drawer-close:focus-visible{ outline:2px solid var(--dsw-alias-state-business-primary); outline-offset:2px; }
.mdk-drawer-body{ padding:12px; display:flex; flex-direction:column; gap:10px; }
.mdk-kv{
  display:grid; grid-template-columns: 88px 1fr; gap:8px;
  padding:8px 10px;
  border-radius:8px;
  background:var(--dsw-specific-sidebar-fill, var(--dsw-alias-bg-overlay));
  border:1px solid var(--dsw-alias-border-l1);
  font:var(--dsw-font-xs-13, 13px/20px var(--dsw-font-family));
}
.mdk-kv dt{ color:var(--dsw-alias-label-secondary); font:var(--dsw-font-xs-strong-13, 500 13px/20px var(--dsw-font-family)); }
.mdk-kv dd{ margin:0; color:var(--dsw-alias-label-primary); word-break:break-all; font-family:var(--ds-font-family-code); font-size:12px; }
.mdk-empty{ color:var(--dsw-alias-label-tertiary); font:var(--dsw-font-xs-13); text-align:center; padding:18px; }
@media (max-width: 768px){
  .mdk-drawer{ right:6px; left:6px; width:auto; top:auto; bottom:12px; max-height:50vh; border-radius:16px; }
}
@media (prefers-reduced-motion: reduce){ .mdk-drawer{ transition:none !important; } }
`;

function ensureStyle() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = STYLE_CSS;
  document.head.appendChild(el);
}

export function Inspector({
  computedStyle,
  tokens,
  onClose,
}: {
  computedStyle?: Record<string, string>;
  tokens?: unknown[];
  onClose?: () => void;
}) {
  ensureStyle();
  const hasData = computedStyle && Object.keys(computedStyle).length > 0;
  return React.createElement(
    'div',
    { className: 'mdk-drawer', role: 'dialog', 'aria-label': 'Style inspector' },
    React.createElement('div', { className: 'mdk-drawer-header' },
      React.createElement('span', null, 'Inspector'),
      onClose ? React.createElement('button', {
        className: 'mdk-drawer-close',
        'aria-label': 'Close inspector',
        onClick: onClose,
        type: 'button' as const,
      }, '×') : null,
    ),
    React.createElement('div', { className: 'mdk-drawer-body' },
      !hasData
        ? React.createElement('div', { className: 'mdk-empty' }, 'No selection — click Inspect to capture computed style.')
        : React.createElement(React.Fragment, null,
            React.createElement('dl', { className: 'mdk-kv' },
              React.createElement('dt', null, 'gap'),
              React.createElement('dd', null, computedStyle?.gap ?? '—'),
              React.createElement('dt', null, 'padding'),
              React.createElement('dd', null, computedStyle?.padding ?? '—'),
              React.createElement('dt', null, 'margin'),
              React.createElement('dd', null, computedStyle?.margin ?? '—'),
              React.createElement('dt', null, 'color'),
              React.createElement('dd', null, computedStyle?.color ?? '—'),
            ),
            React.createElement('div', { style: { color: 'var(--dsw-alias-label-secondary)', font: 'var(--dsw-font-xxs-12)' } },
              `tokens: ${tokens?.length ?? 0} — slot occupants via DSH Theme`
            ),
          ),
    ),
  );
}
