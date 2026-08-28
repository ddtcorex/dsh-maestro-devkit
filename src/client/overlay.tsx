import * as React from 'react';

export function OverlayToolbar({ onCapture, onInspect }: { onCapture?: () => void; onInspect?: () => void }) {
  const btnBase: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
    padding: '0 12px',
    borderRadius: 8,
    border: '1px solid var(--dsw-alias-border-l2)',
    background: 'var(--dsw-alias-bg-base)',
    color: 'var(--dsw-alias-label-primary)',
    font: 'var(--dsw-font-s-medium-13, 500 13px/20px var(--dsw-font-family-base))',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  };
  return React.createElement(
    'div',
    {
      style: {
        position: 'fixed',
        top: 64,
        right: 12,
        zIndex: 9999,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 8px',
        borderRadius: 12,
        background: 'var(--dsw-alias-bg-base)',
        border: '1px solid var(--dsw-alias-border-l2)',
        boxShadow: 'var(--dsw-shadow-m, 0 4px 12px rgba(0,0,0,0.12))',
        color: 'var(--dsw-alias-label-primary)',
        font: 'var(--dsw-font-s-regular-13, 400 13px/20px var(--dsw-font-family-base))',
      },
      role: 'toolbar',
      'aria-label': 'Maestro DevKit',
    },
    React.createElement(
      'button',
      {
        onClick: onCapture,
        style: btnBase,
        onMouseEnter: (e: any) => (e.currentTarget.style.background = 'var(--dsw-alias-interactive-bg-hover)'),
        onMouseLeave: (e: any) => (e.currentTarget.style.background = 'var(--dsw-alias-bg-base)'),
      },
      'Capture',
    ),
    React.createElement(
      'button',
      {
        onClick: onInspect,
        style: btnBase,
        onMouseEnter: (e: any) => (e.currentTarget.style.background = 'var(--dsw-alias-interactive-bg-hover)'),
        onMouseLeave: (e: any) => (e.currentTarget.style.background = 'var(--dsw-alias-bg-base)'),
      },
      'Inspect',
    ),
    React.createElement('span', { style: { color: 'var(--dsw-alias-label-secondary)', font: 'var(--dsw-font-s-regular-12, 400 12px/16px var(--dsw-font-family-base))', padding: '0 4px' } }, 'DevKit'),
  );
}

export function Overlay() {
  return React.createElement(OverlayToolbar, {});
}
