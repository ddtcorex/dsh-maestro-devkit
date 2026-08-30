import * as React from 'react';

const POS_KEY = 'maestro-devkit:bar-pos';
const FOLDED_KEY = 'maestro-devkit:folded';
// Default: giữa màn hình, sát bên phải (right 0, vertical center)
const _DEFAULT_POS = { right: 0, centerY: true } as const;
void _DEFAULT_POS;

type Pos = { right: number; y: number };

function readPos(): Pos | null {
  try {
    // Preferred: right-anchored format
    const rawRight = typeof window !== 'undefined' ? window.localStorage.getItem(POS_KEY + ':right') : null;
    if (rawRight) {
      const p = JSON.parse(rawRight);
      if (typeof p?.right === 'number' && typeof p?.y === 'number') return { right: p.right, y: p.y };
    }
    // Fallback: legacy left-anchored {x,y}
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(POS_KEY) : null;
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (typeof p?.x === 'number' && typeof p?.y === 'number') {
      // Convert left to right using current viewport and approx width
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const approxW = 48;
      return { right: vw - p.x - approxW, y: p.y };
    }
    if (typeof p?.right === 'number' && typeof p?.y === 'number') return { right: p.right, y: p.y };
  } catch {}
  return null;
}
function writePos(p: Pos) {
  try {
    window.localStorage.setItem(POS_KEY + ':right', JSON.stringify(p));
    // Keep legacy key in sync for older builds (approx)
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
    window.localStorage.setItem(POS_KEY, JSON.stringify({ x: vw - p.right - 48, y: p.y }));
  } catch {}
}
function readFolded(): boolean {
  try {
    const v = typeof window !== 'undefined' ? window.localStorage.getItem(FOLDED_KEY) : null;
    if (v === '1') return true;
    if (v === '0') return false;
  } catch {}
  return true;
}
function writeFolded(v: boolean) {
  try { window.localStorage.setItem(FOLDED_KEY, v ? '1' : '0'); } catch {}
}

const STYLE_ID = 'maestro-devkit-floating-style';
const STYLE_CSS = `
/* Ensure overlay is above right sidebar (fIyUMG_sidebarCol z40) */
.fIyUMG_overlayLayer{ z-index:100 !important; }
.mdk-bar{
  position:fixed;
  z-index:10000 !important;
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding:4px 6px;
  border-radius:999px;
  background:var(--dsw-alias-bg-base);
  border:1px solid var(--dsw-alias-border-l2);
  box-shadow:var(--dsw-shadow-lv2, 0 4px 12px rgba(0,0,0,0.08));
  color:var(--dsw-alias-label-primary);
  font:var(--dsw-font-xxs-12, 400 11px/14px var(--dsw-font-family));
  user-select:none;
  touch-action:none;
  transition:box-shadow 120ms var(--ds-ease-in-out, ease), opacity 120ms var(--ds-ease-in-out, ease), transform 120ms var(--ds-ease-in-out, ease);
  max-width:calc(100vw - 16px);
}
.mdk-bar.mdk-dragging{
  box-shadow:var(--dsw-shadow-lv3, 0 8px 32px rgba(0,0,0,0.12));
  cursor:grabbing;
}
.mdk-bar.mdk-dragging .mdk-fold{ cursor:grabbing; }
.mdk-brand{
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding:0 2px 0 2px;
  font:var(--dsw-font-xxxs-strong-11, 500 11px/14px var(--dsw-font-family));
  letter-spacing:0.02em;
  color:var(--dsw-alias-label-secondary);
  white-space:nowrap;
}
.mdk-dot{
  width:6px; height:6px; border-radius:999px;
  background:var(--dsw-alias-state-success-primary);
  box-shadow:0 0 0 3px var(--dsw-alias-state-success-tertiary);
  flex:0 0 auto;
}
.mdk-actions{
  display:inline-flex;
  align-items:center;
  gap:6px;
  overflow:hidden;
  transition: max-width 160ms var(--ds-ease-in-out, ease), opacity 120ms var(--ds-ease-in-out, ease);
  max-width:520px;
  opacity:1;
}
.mdk-bar.mdk-folded{
  padding:4px 6px;
  gap:6px;
  border-radius:8px 0 0 8px;
  right:0;
}
.mdk-bar.mdk-folded .mdk-actions{
  max-width:0;
  opacity:0;
  pointer-events:none;
}
.mdk-bar.mdk-folded .mdk-brand{ display:none; }
.mdk-bar.mdk-folded .mdk-sep{ display:none; }
.mdk-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  height:28px;
  padding:0 10px;
  border-radius:999px;
  border:1px solid var(--dsw-alias-border-l2);
  background:var(--dsw-alias-bg-base);
  color:var(--dsw-alias-label-primary);
  cursor:pointer;
  white-space:nowrap;
  font:var(--dsw-font-xxs-12, 400 12px/18px var(--dsw-font-family));
  line-height:1;
}
.mdk-btn:hover{ background:var(--dsw-alias-interactive-bg-hover); }
.mdk-btn:active{ background:var(--dsw-alias-interactive-bg-active); }
.mdk-btn:focus-visible{ outline:2px solid var(--dsw-alias-state-business-primary); outline-offset:2px; }
.mdk-btn:disabled{ opacity:0.45; cursor:not-allowed; }
.mdk-btn-primary{
  background:var(--dsw-alias-button-primary-fill);
  color:var(--dsw-alias-label-primary-foreground);
  border-color:transparent;
}
.mdk-btn-primary:hover{ background:var(--dsw-alias-button-primary-hover); }
/* Toggle + Drag: 3 hàng dọc — vừa kéo vừa bấm, bỏ border, vùng click rộng */
.mdk-fold{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:28px;
  height:28px;
  padding:0 6px;
  border:none;
  border-radius:6px;
  background:transparent;
  color:var(--dsw-alias-label-secondary);
  cursor:grab;
  flex:0 0 auto;
  touch-action:none;
}
.mdk-fold:active{ cursor:grabbing; }
.mdk-fold:hover{ background:var(--dsw-alias-interactive-bg-hover); color:var(--dsw-alias-label-primary); }
.mdk-fold:focus-visible{ outline:2px solid var(--dsw-alias-state-business-primary); outline-offset:2px; }
.mdk-sep{ width:1px; height:18px; background:var(--dsw-alias-border-l2); flex:0 0 auto; }
/* Mobile: compact hơn nhiều — bar nhỏ gọn, icon-only, không chiếm chỗ */
@media (max-width: 768px){
  .mdk-bar{
    padding:3px 4px;
    gap:4px;
    border-radius:12px;
    max-width:calc(100vw - 8px);
  }
  .mdk-bar.mdk-folded{ padding:3px 4px; }
  .mdk-brand{ display:none; }
  .mdk-btn{ height:30px; min-width:30px; padding:0 8px; font-size:12px; gap:4px; }
  .mdk-btn.mdk-icon-only{ width:30px; height:30px; padding:0; }
  .mdk-fold{ width:32px; height:28px; border-radius:5px; }
  .mdk-actions{ gap:4px; }
  .mdk-sep{ height:16px; }
}
@media (prefers-reduced-motion: reduce){
  .mdk-bar, .mdk-actions{ transition:none !important; }
}
.mdk-sr{ position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; }
`;

// Icons — inline SVG, no emoji, 16px
function IconFold({ folded }: { folded: boolean }) {
  // Nút chính: 3 hàng dọc liền nhau (|||) — hẹp ngang, rõ trạng thái
  // folded = đang thu gọn → 3 vạch đứng; expanded → 3 vạch hơi mờ để gợi ý bấm thu lại
  return React.createElement('svg', {
    width: 10, height: 14, viewBox: '0 0 10 14', fill: 'none', 'aria-hidden': true,
    style: { opacity: folded ? 1 : 0.9, transition: 'opacity 120ms var(--ds-ease-in-out, ease)' },
  } as any,
    React.createElement('rect', { x: 1, y: 2, width: 1.8, height: 10, rx: 0.9, fill: 'currentColor' }),
    React.createElement('rect', { x: 4.1, y: 2, width: 1.8, height: 10, rx: 0.9, fill: 'currentColor' }),
    React.createElement('rect', { x: 7.2, y: 2, width: 1.8, height: 10, rx: 0.9, fill: 'currentColor' }),
  );
}
function IconCapture() {
  return React.createElement('svg', { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true } as any,
    React.createElement('rect', { x: 2, y: 5, width: 12, height: 8, rx: 1.5, stroke: 'currentColor', strokeWidth: 1.3 }),
    React.createElement('circle', { cx: 8, cy: 9, r: 2.2, stroke: 'currentColor', strokeWidth: 1.3 }),
    React.createElement('path', { d: 'M6 5l1-1.5h2L10 5', stroke: 'currentColor', strokeWidth: 1.3, strokeLinejoin: 'round' }),
  );
}
function IconInspect() {
  return React.createElement('svg', { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true } as any,
    React.createElement('path', { d: 'M1.5 8s2.5-4 6.5-4 6.5 4 6.5 4-2.5 4-6.5 4-6.5-4-6.5-4z', stroke: 'currentColor', strokeWidth: 1.3 }),
    React.createElement('circle', { cx: 8, cy: 8, r: 2, stroke: 'currentColor', strokeWidth: 1.3 }),
  );
}
function IconIsolate() {
  return React.createElement('svg', { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true } as any,
    React.createElement('path', { d: 'M5 3H3v2 M11 3h2v2 M3 11v2h2 M11 13h2v-2', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round' }),
    React.createElement('rect', { x: 5.5, y: 5.5, width: 5, height: 5, rx: 0.8, stroke: 'currentColor', strokeWidth: 1.2 }),
  );
}

function ensureStyle() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = STYLE_CSS;
  document.head.appendChild(el);
}

export function OverlayToolbar({
  onCapture,
  onInspect,
  onIsolate,
}: {
  onCapture?: () => void;
  onInspect?: () => void;
  onIsolate?: () => void;
}) {
  ensureStyle();

  const [folded, setFolded] = React.useState<boolean>(() => readFolded());
  const [pos, setPos] = React.useState<Pos | null>(() => readPos());
  const [dragging, setDragging] = React.useState(false);
  const barRef = React.useRef<HTMLDivElement | null>(null);
  const dragState = React.useRef<{ dx: number; dy: number; startX: number; startY: number; didDrag: boolean } | null>(null);

  // Persist folded
  React.useEffect(() => { writeFolded(folded); }, [folded]);

  // Default: giữa màn hình sát bên phải (right:0, top:50% + translateY)
  // pos.right is distance from viewport right to bar's right edge — keeps Fold stationary when width changes
  const stylePos = React.useMemo<React.CSSProperties>(() => {
    if (pos) return { right: pos.right, top: pos.y, left: 'auto' as const, transform: 'none' as const };
    return { top: '50%', right: 0, left: 'auto' as const, transform: 'translateY(-50%)' };
  }, [pos]);

  const clampToViewportRight = React.useCallback((right: number, y: number) => {
    const pad = 8;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 768;
    const rect = barRef.current?.getBoundingClientRect();
    const w = rect?.width ?? 48;
    const h = rect?.height ?? 40;
    // right is distance from viewport right; bar left = vw - right - w must stay >= pad
    const maxRight = vw - w - pad;
    const clampedRight = Math.max(pad, Math.min(right, maxRight));
    const ny = Math.max(pad, Math.min(y, vh - h - pad));
    return { right: clampedRight, y: ny };
  }, []);

  const onPointerDown = React.useCallback((e: React.PointerEvent) => {
    const target = e.currentTarget as HTMLElement;
    const rect = barRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = e.clientX - rect.left;
    const dy = e.clientY - rect.top;
    dragState.current = { dx, dy, startX: e.clientX, startY: e.clientY, didDrag: false };
    setDragging(true);
    try { (target as any).setPointerCapture?.(e.pointerId); } catch {}
    e.preventDefault();
  }, []);

  React.useEffect(() => {
    if (!dragging) return;
    const onMove = (ev: PointerEvent) => {
      const st = dragState.current;
      if (!st) return;
      if (!st.didDrag && Math.hypot(ev.clientX - st.startX, ev.clientY - st.startY) > 5) st.didDrag = true;
      const nx = ev.clientX - st.dx;
      const ny = ev.clientY - st.dy;
      const vw = window.innerWidth;
      const w = barRef.current?.getBoundingClientRect().width ?? 48;
      const right = vw - nx - w;
      const clamped = clampToViewportRight(right, ny);
      setPos(clamped);
    };
    const onUp = (ev: PointerEvent) => {
      const st = dragState.current;
      if (st) {
        if (st.didDrag) {
          const nx = ev.clientX - st.dx;
          const ny = ev.clientY - st.dy;
          const vw = window.innerWidth;
          const w = barRef.current?.getBoundingClientRect().width ?? 48;
          const right = vw - nx - w;
          const clamped = clampToViewportRight(right, ny);
          setPos(clamped);
          writePos(clamped);
        }
        setTimeout(() => { if (dragState.current === st) dragState.current = null; }, 0);
      }
      setDragging(false);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp as any);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp as any);
    };
  }, [dragging, clampToViewportRight]);

  const toggleFold = React.useCallback(() => {
    // Right-anchored pos: Fold stays at same viewport X, no adjustment needed
    setFolded(v => !v);
  }, []);
  const resetPos = React.useCallback(() => {
    try { window.localStorage.removeItem(POS_KEY); window.localStorage.removeItem(POS_KEY + ':right'); } catch {}
    setPos(null);
  }, []);
  const onFoldClick = React.useCallback((e: React.MouseEvent) => {
    if (dragState.current?.didDrag) { e.preventDefault(); return; }
    toggleFold();
  }, [toggleFold]);
  const onFoldKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFold(); return; }
    const step = (e as any).shiftKey ? 24 : 8;
    let cur: Pos;
    if (pos) cur = pos;
    else {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const rect = barRef.current?.getBoundingClientRect();
      const w = rect?.width ?? 48;
      const h = rect?.height ?? 36;
      // Default pos when not yet dragged: right = 0 (sát phải) is already handled by stylePos null,
      // but for keyboard nudge from default, start from right=0
      cur = { right: 0, y: Math.round(vh / 2 - h / 2) };
      void vw; void w;
    }
    if (e.key === 'Home') { e.preventDefault(); resetPos(); return; }
    let nr = cur.right, ny = cur.y;
    if (e.key === 'ArrowLeft') nr += step; // moving left increases right distance? Actually left arrow should move bar left, which increases right? Let's keep intuitive: ArrowLeft moves bar left, so right increases
    else if (e.key === 'ArrowRight') nr -= step;
    else if (e.key === 'ArrowUp') ny -= step;
    else if (e.key === 'ArrowDown') ny += step;
    else return;
    e.preventDefault();
    const clamped = clampToViewportRight(nr, ny);
    setPos(clamped);
    writePos(clamped);
  }, [pos, clampToViewportRight, toggleFold, resetPos]);

  // Detect mobile for icon-only collapse — guard for jsdom without matchMedia
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const mm = (window as any).matchMedia;
    if (typeof mm !== 'function') return;
    const m = mm('(max-width: 768px)');
    const upd = () => setIsMobile(m.matches);
    upd();
    try { m.addEventListener('change', upd); return () => m.removeEventListener('change', upd); }
    catch { m.addListener?.(upd); return () => m.removeListener?.(upd); }
  }, []);

  return React.createElement(
    'div',
    {
      ref: barRef as any,
      className: `mdk-bar${dragging ? ' mdk-dragging' : ''}${folded ? ' mdk-folded' : ''}`,
      style: stylePos,
      role: 'toolbar',
      'aria-label': 'Maestro DevKit',
      'aria-orientation': 'horizontal',
    },
    // Brand — bên trái ngoài cùng khi mở ra
    React.createElement('span', { className: 'mdk-brand', 'aria-hidden': folded ? true : undefined },
      React.createElement('span', { className: 'mdk-dot', 'aria-hidden': true }),
      React.createElement('span', null, 'DevKit'),
    ),

    // Actions group — đẩy sang trái (nở sang trái, nằm bên trái icon 3 vạch)
    React.createElement('span', { className: 'mdk-actions', role: 'group', 'aria-label': 'DevKit actions' },
      React.createElement('button', {
        onClick: onCapture,
        className: `mdk-btn${isMobile ? ' mdk-icon-only' : ''}`,
        type: 'button' as const,
        'aria-label': 'Capture',
        title: 'Capture',
      },
        React.createElement(IconCapture, null),
        isMobile ? null : 'Capture',
      ),
      React.createElement('button', {
        onClick: onInspect,
        className: `mdk-btn${isMobile ? ' mdk-icon-only' : ''}`,
        type: 'button' as const,
        'aria-label': 'Inspect',
        title: 'Inspect',
      },
        React.createElement(IconInspect, null),
        isMobile ? null : 'Inspect',
      ),
      React.createElement('button', {
        onClick: onIsolate,
        className: `mdk-btn mdk-btn-primary${isMobile ? ' mdk-icon-only' : ''}`,
        type: 'button' as const,
        'aria-label': 'Isolate',
        title: 'Isolate',
      },
        React.createElement(IconIsolate, null),
        isMobile ? null : 'Isolate',
      ),
    ),

    // Icon 3 vạch — không border, vùng click rộng, nằm bên phải ngoài cùng, vừa kéo vừa bấm để nở sang trái
    React.createElement('button', {
      className: 'mdk-fold',
      'aria-label': folded ? 'Expand toolbar — drag to move' : 'Collapse toolbar — drag to move',
      'aria-expanded': (!folded).toString(),
      onPointerDown,
      onKeyDown: onFoldKeyDown,
      onDoubleClick: resetPos,
      onClick: onFoldClick,
      title: folded ? 'Expand — drag to move' : 'Collapse — drag to move',
      type: 'button' as const,
    }, React.createElement(IconFold, { folded })),
  );
}

export function Overlay() {
  return React.createElement(OverlayToolbar, {});
}
