import * as React from 'react';

export function OverlayToolbar({ onCapture, onInspect }: { onCapture?: () => void; onInspect?: () => void }) {
  return React.createElement('div', { style: { position: 'fixed', top: 8, right: 8, zIndex: 9999, background: 'white', border: '1px solid #ddd', borderRadius: 8, padding: 8, display: 'flex', gap: 8 } },
    React.createElement('button', { onClick: onCapture }, 'Capture'),
    React.createElement('button', { onClick: onInspect }, 'Inspect'),
    React.createElement('span', null, 'DevKit Overlay')
  );
}

export function Overlay() {
  return React.createElement(OverlayToolbar, {});
}
