window.__ModuleLoader__.load({ id: "@ddtcorex/dsh-maestro-devkit", factory: (require) => {
var __modules = {};
__modules["overlay.js"] = function (require, module, exports) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverlayToolbar = OverlayToolbar;
exports.Overlay = Overlay;
const React = __importStar(require("react"));
const POS_KEY = 'maestro-devkit:bar-pos';
const FOLDED_KEY = 'maestro-devkit:folded';
// Default: giữa màn hình, sát bên phải (right 0, vertical center)
const _DEFAULT_POS = { right: 0, centerY: true };
void _DEFAULT_POS;
function readPos() {
    try {
        // Preferred: right-anchored format
        const rawRight = typeof window !== 'undefined' ? window.localStorage.getItem(POS_KEY + ':right') : null;
        if (rawRight) {
            const p = JSON.parse(rawRight);
            if (typeof p?.right === 'number' && typeof p?.y === 'number')
                return { right: p.right, y: p.y };
        }
        // Fallback: legacy left-anchored {x,y}
        const raw = typeof window !== 'undefined' ? window.localStorage.getItem(POS_KEY) : null;
        if (!raw)
            return null;
        const p = JSON.parse(raw);
        if (typeof p?.x === 'number' && typeof p?.y === 'number') {
            // Convert left to right using current viewport and approx width
            const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
            const approxW = 48;
            return { right: vw - p.x - approxW, y: p.y };
        }
        if (typeof p?.right === 'number' && typeof p?.y === 'number')
            return { right: p.right, y: p.y };
    }
    catch { }
    return null;
}
function writePos(p) {
    try {
        window.localStorage.setItem(POS_KEY + ':right', JSON.stringify(p));
        // Keep legacy key in sync for older builds (approx)
        const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
        window.localStorage.setItem(POS_KEY, JSON.stringify({ x: vw - p.right - 48, y: p.y }));
    }
    catch { }
}
function readFolded() {
    try {
        const v = typeof window !== 'undefined' ? window.localStorage.getItem(FOLDED_KEY) : null;
        if (v === '1')
            return true;
        if (v === '0')
            return false;
    }
    catch { }
    return true;
}
function writeFolded(v) {
    try {
        window.localStorage.setItem(FOLDED_KEY, v ? '1' : '0');
    }
    catch { }
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
function IconFold({ folded }) {
    // Nút chính: 3 hàng dọc liền nhau (|||) — hẹp ngang, rõ trạng thái
    // folded = đang thu gọn → 3 vạch đứng; expanded → 3 vạch hơi mờ để gợi ý bấm thu lại
    return React.createElement('svg', {
        width: 10, height: 14, viewBox: '0 0 10 14', fill: 'none', 'aria-hidden': true,
        style: { opacity: folded ? 1 : 0.9, transition: 'opacity 120ms var(--ds-ease-in-out, ease)' },
    }, React.createElement('rect', { x: 1, y: 2, width: 1.8, height: 10, rx: 0.9, fill: 'currentColor' }), React.createElement('rect', { x: 4.1, y: 2, width: 1.8, height: 10, rx: 0.9, fill: 'currentColor' }), React.createElement('rect', { x: 7.2, y: 2, width: 1.8, height: 10, rx: 0.9, fill: 'currentColor' }));
}
function IconCapture() {
    return React.createElement('svg', { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true }, React.createElement('rect', { x: 2, y: 5, width: 12, height: 8, rx: 1.5, stroke: 'currentColor', strokeWidth: 1.3 }), React.createElement('circle', { cx: 8, cy: 9, r: 2.2, stroke: 'currentColor', strokeWidth: 1.3 }), React.createElement('path', { d: 'M6 5l1-1.5h2L10 5', stroke: 'currentColor', strokeWidth: 1.3, strokeLinejoin: 'round' }));
}
function IconInspect() {
    return React.createElement('svg', { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true }, React.createElement('path', { d: 'M1.5 8s2.5-4 6.5-4 6.5 4 6.5 4-2.5 4-6.5 4-6.5-4-6.5-4z', stroke: 'currentColor', strokeWidth: 1.3 }), React.createElement('circle', { cx: 8, cy: 8, r: 2, stroke: 'currentColor', strokeWidth: 1.3 }));
}
function IconIsolate() {
    return React.createElement('svg', { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true }, React.createElement('path', { d: 'M5 3H3v2 M11 3h2v2 M3 11v2h2 M11 13h2v-2', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round' }), React.createElement('rect', { x: 5.5, y: 5.5, width: 5, height: 5, rx: 0.8, stroke: 'currentColor', strokeWidth: 1.2 }));
}
function ensureStyle() {
    if (typeof document === 'undefined')
        return;
    if (document.getElementById(STYLE_ID))
        return;
    const el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = STYLE_CSS;
    document.head.appendChild(el);
}
function OverlayToolbar({ onCapture, onInspect, onIsolate, }) {
    ensureStyle();
    const [folded, setFolded] = React.useState(() => readFolded());
    const [pos, setPos] = React.useState(() => readPos());
    const [dragging, setDragging] = React.useState(false);
    const barRef = React.useRef(null);
    const dragState = React.useRef(null);
    // Persist folded
    React.useEffect(() => { writeFolded(folded); }, [folded]);
    // Default: giữa màn hình sát bên phải (right:0, top:50% + translateY)
    // pos.right is distance from viewport right to bar's right edge — keeps Fold stationary when width changes
    const stylePos = React.useMemo(() => {
        if (pos)
            return { right: pos.right, top: pos.y, left: 'auto', transform: 'none' };
        return { top: '50%', right: 0, left: 'auto', transform: 'translateY(-50%)' };
    }, [pos]);
    const clampToViewportRight = React.useCallback((right, y) => {
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
    const onPointerDown = React.useCallback((e) => {
        const target = e.currentTarget;
        const rect = barRef.current?.getBoundingClientRect();
        if (!rect)
            return;
        const dx = e.clientX - rect.left;
        const dy = e.clientY - rect.top;
        dragState.current = { dx, dy, startX: e.clientX, startY: e.clientY, didDrag: false };
        setDragging(true);
        try {
            target.setPointerCapture?.(e.pointerId);
        }
        catch { }
        e.preventDefault();
    }, []);
    React.useEffect(() => {
        if (!dragging)
            return;
        const onMove = (ev) => {
            const st = dragState.current;
            if (!st)
                return;
            if (!st.didDrag && Math.hypot(ev.clientX - st.startX, ev.clientY - st.startY) > 5)
                st.didDrag = true;
            const nx = ev.clientX - st.dx;
            const ny = ev.clientY - st.dy;
            const vw = window.innerWidth;
            const w = barRef.current?.getBoundingClientRect().width ?? 48;
            const right = vw - nx - w;
            const clamped = clampToViewportRight(right, ny);
            setPos(clamped);
        };
        const onUp = (ev) => {
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
                setTimeout(() => { if (dragState.current === st)
                    dragState.current = null; }, 0);
            }
            setDragging(false);
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
        return () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('pointercancel', onUp);
        };
    }, [dragging, clampToViewportRight]);
    const toggleFold = React.useCallback(() => {
        // Right-anchored pos: Fold stays at same viewport X, no adjustment needed
        setFolded(v => !v);
    }, []);
    const resetPos = React.useCallback(() => {
        try {
            window.localStorage.removeItem(POS_KEY);
            window.localStorage.removeItem(POS_KEY + ':right');
        }
        catch { }
        setPos(null);
    }, []);
    const onFoldClick = React.useCallback((e) => {
        if (dragState.current?.didDrag) {
            e.preventDefault();
            return;
        }
        toggleFold();
    }, [toggleFold]);
    const onFoldKeyDown = React.useCallback((e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFold();
            return;
        }
        const step = e.shiftKey ? 24 : 8;
        let cur;
        if (pos)
            cur = pos;
        else {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const rect = barRef.current?.getBoundingClientRect();
            const w = rect?.width ?? 48;
            const h = rect?.height ?? 36;
            // Default pos when not yet dragged: right = 0 (sát phải) is already handled by stylePos null,
            // but for keyboard nudge from default, start from right=0
            cur = { right: 0, y: Math.round(vh / 2 - h / 2) };
            void vw;
            void w;
        }
        if (e.key === 'Home') {
            e.preventDefault();
            resetPos();
            return;
        }
        let nr = cur.right, ny = cur.y;
        if (e.key === 'ArrowLeft')
            nr += step; // moving left increases right distance? Actually left arrow should move bar left, which increases right? Let's keep intuitive: ArrowLeft moves bar left, so right increases
        else if (e.key === 'ArrowRight')
            nr -= step;
        else if (e.key === 'ArrowUp')
            ny -= step;
        else if (e.key === 'ArrowDown')
            ny += step;
        else
            return;
        e.preventDefault();
        const clamped = clampToViewportRight(nr, ny);
        setPos(clamped);
        writePos(clamped);
    }, [pos, clampToViewportRight, toggleFold, resetPos]);
    // Detect mobile for icon-only collapse — guard for jsdom without matchMedia
    const [isMobile, setIsMobile] = React.useState(false);
    React.useEffect(() => {
        const mm = window.matchMedia;
        if (typeof mm !== 'function')
            return;
        const m = mm('(max-width: 768px)');
        const upd = () => setIsMobile(m.matches);
        upd();
        try {
            m.addEventListener('change', upd);
            return () => m.removeEventListener('change', upd);
        }
        catch {
            m.addListener?.(upd);
            return () => m.removeListener?.(upd);
        }
    }, []);
    return React.createElement('div', {
        ref: barRef,
        className: `mdk-bar${dragging ? ' mdk-dragging' : ''}${folded ? ' mdk-folded' : ''}`,
        style: stylePos,
        role: 'toolbar',
        'aria-label': 'Maestro DevKit',
        'aria-orientation': 'horizontal',
    }, 
    // Brand — bên trái ngoài cùng khi mở ra
    React.createElement('span', { className: 'mdk-brand', 'aria-hidden': folded ? true : undefined }, React.createElement('span', { className: 'mdk-dot', 'aria-hidden': true }), React.createElement('span', null, 'DevKit')), 
    // Actions group — đẩy sang trái (nở sang trái, nằm bên trái icon 3 vạch)
    React.createElement('span', { className: 'mdk-actions', role: 'group', 'aria-label': 'DevKit actions' }, React.createElement('button', {
        onClick: onCapture,
        className: `mdk-btn${isMobile ? ' mdk-icon-only' : ''}`,
        type: 'button',
        'aria-label': 'Capture',
        title: 'Capture',
    }, React.createElement(IconCapture, null), isMobile ? null : 'Capture'), React.createElement('button', {
        onClick: onInspect,
        className: `mdk-btn${isMobile ? ' mdk-icon-only' : ''}`,
        type: 'button',
        'aria-label': 'Inspect',
        title: 'Inspect',
    }, React.createElement(IconInspect, null), isMobile ? null : 'Inspect'), React.createElement('button', {
        onClick: onIsolate,
        className: `mdk-btn mdk-btn-primary${isMobile ? ' mdk-icon-only' : ''}`,
        type: 'button',
        'aria-label': 'Isolate',
        title: 'Isolate',
    }, React.createElement(IconIsolate, null), isMobile ? null : 'Isolate')), 
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
        type: 'button',
    }, React.createElement(IconFold, { folded })));
}
function Overlay() {
    return React.createElement(OverlayToolbar, {});
}
};
__modules["sandbox.js"] = function (require, module, exports) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sandbox = Sandbox;
exports.SandboxContainer = SandboxContainer;
const React = __importStar(require("react"));
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
    if (typeof document === 'undefined')
        return;
    if (document.getElementById(STYLE_ID))
        return;
    const el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = STYLE_CSS;
    document.head.appendChild(el);
}
function Sandbox({ slot, props, onPropsChange, }) {
    ensureStyle();
    const [text, setText] = React.useState(() => JSON.stringify(props ?? {}, null, 2));
    const [error, setError] = React.useState(null);
    const handleRerender = () => {
        try {
            const parsed = JSON.parse(text);
            setError(null);
            onPropsChange?.(parsed);
        }
        catch {
            setError('Invalid JSON — fix the syntax and try again.');
        }
    };
    return React.createElement('div', { className: 'mdk-sandbox' }, React.createElement('h2', null, `Sandbox: ${slot}`), React.createElement('textarea', {
        value: text,
        onChange: (e) => setText(e.target.value),
        'aria-label': 'Sandbox props JSON',
        spellCheck: false,
    }), React.createElement('div', { style: { marginTop: 12 } }, React.createElement('button', { onClick: handleRerender, className: 'mdk-btn', type: 'button' }, 'Re-render')), error ? React.createElement('div', { className: 'mdk-error', role: 'alert' }, error) : null);
}
function SandboxContainer() {
    ensureStyle();
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const slot = params.get('__devkit_sandbox') ?? 'layout:main';
    const propsStr = params.get('props');
    let initialProps = {};
    try {
        initialProps = propsStr ? JSON.parse(propsStr) : {};
    }
    catch { }
    const [props, setProps] = React.useState(initialProps);
    return React.createElement(Sandbox, { slot, props, onPropsChange: setProps });
}
};
__modules["inspector.js"] = function (require, module, exports) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inspector = Inspector;
const React = __importStar(require("react"));
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
    if (typeof document === 'undefined')
        return;
    if (document.getElementById(STYLE_ID))
        return;
    const el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = STYLE_CSS;
    document.head.appendChild(el);
}
function Inspector({ computedStyle, tokens, onClose, }) {
    ensureStyle();
    const hasData = computedStyle && Object.keys(computedStyle).length > 0;
    return React.createElement('div', { className: 'mdk-drawer', role: 'dialog', 'aria-label': 'Style inspector' }, React.createElement('div', { className: 'mdk-drawer-header' }, React.createElement('span', null, 'Inspector'), onClose ? React.createElement('button', {
        className: 'mdk-drawer-close',
        'aria-label': 'Close inspector',
        onClick: onClose,
        type: 'button',
    }, '×') : null), React.createElement('div', { className: 'mdk-drawer-body' }, !hasData
        ? React.createElement('div', { className: 'mdk-empty' }, 'No selection — click Inspect to capture computed style.')
        : React.createElement(React.Fragment, null, React.createElement('dl', { className: 'mdk-kv' }, React.createElement('dt', null, 'gap'), React.createElement('dd', null, computedStyle?.gap ?? '—'), React.createElement('dt', null, 'padding'), React.createElement('dd', null, computedStyle?.padding ?? '—'), React.createElement('dt', null, 'margin'), React.createElement('dd', null, computedStyle?.margin ?? '—'), React.createElement('dt', null, 'color'), React.createElement('dd', null, computedStyle?.color ?? '—')), React.createElement('div', { style: { color: 'var(--dsw-alias-label-secondary)', font: 'var(--dsw-font-xxs-12)' } }, `tokens: ${tokens?.length ?? 0} — slot occupants via DSH Theme`))));
}
};
__modules["index.js"] = function (require, module, exports) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.inject = void 0;
exports.apply = apply;
const React = __importStar(require("react"));
const overlay_js_1 = require("./overlay.js");
const sandbox_js_1 = require("./sandbox.js");
const inspector_js_1 = require("./inspector.js");
exports.inject = ['slots', 'connection'];
function apply(ctx) {
    ctx.effect(() => {
        const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
        if (params.has('__devkit_sandbox')) {
            const slots = ctx.slots ?? ctx.get?.('slots');
            if (!slots?.inject || !slots?.register)
                return () => { };
            const dispose = slots.inject('shell.overlay', () => slots.register({ name: 'shell.overlay', id: 'maestro-devkit-sandbox', order: 100 }, () => React.createElement(sandbox_js_1.SandboxContainer, {})));
            return () => { try {
                dispose?.();
            }
            catch { } };
        }
        const slots = ctx.slots ?? ctx.get?.('slots');
        const conn = ctx.connection ?? ctx.get?.('connection');
        if (!slots?.inject || !slots?.register)
            return () => { };
        const callHost = async (action) => {
            // Prefer rpc.call (registered with authority:loopback on host). Fallback to conn.call for legacy.
            const tryCall = async (fn) => {
                try {
                    const r = await fn('/dsh-maestro-devkit', { action });
                    if (r !== undefined)
                        return r;
                }
                catch (e) {
                    console.warn('[maestro-devkit] host call failed', e);
                }
                return undefined;
            };
            if (conn?.rpc?.call) {
                const r = await tryCall(conn.rpc.call.bind(conn.rpc));
                if (r !== undefined)
                    return r;
            }
            if (conn?.call) {
                const r = await tryCall(conn.call.bind(conn));
                if (r !== undefined)
                    return r;
            }
            return undefined;
        };
        const dispose = slots.inject('shell.overlay', () => slots.register({ name: 'shell.overlay', id: 'maestro-devkit-overlay', order: 100 }, () => {
            const [inspected, setInspected] = React.useState(null);
            return React.createElement(React.Fragment, null, React.createElement(overlay_js_1.OverlayToolbar, {
                onCapture: async () => { const r = await callHost('capture'); console.log('[devkit] capture', r); },
                onInspect: async () => {
                    const r = await callHost('inspect');
                    // Fallback to empty inspector so popup always appears for validation
                    setInspected(r ?? { computedStyle: {}, tokens: [] });
                },
                onIsolate: () => {
                    const url = `/?__devkit_sandbox=${encodeURIComponent('layout:main')}&props=${encodeURIComponent('{}')}`;
                    window.open(url, '_blank');
                },
            }), inspected
                ? React.createElement(inspector_js_1.Inspector, {
                    computedStyle: inspected.computedStyle ?? inspected.computed_style ?? {},
                    tokens: inspected.tokens ?? [],
                    onClose: () => setInspected(null),
                })
                : null);
        }));
        return () => {
            try {
                dispose?.();
            }
            catch { }
        };
    });
    // Host→Client RPC: exposes real DOM introspection to the host's frontend_inspect tool
    ctx.effect(() => {
        const conn = ctx.connection ?? ctx.get?.('connection');
        if (!conn?.rpc?.handle)
            return () => { };
        const dispose = conn.rpc.handle('/dsh-maestro-devkit-client', async (opts) => {
            const selector = opts?.selector;
            let computedStyle = {};
            if (selector && typeof document !== 'undefined') {
                const el = document.querySelector(selector);
                if (el) {
                    const cs = getComputedStyle(el);
                    computedStyle = { gap: cs.gap, padding: cs.padding, margin: cs.margin, color: cs.color };
                }
            }
            return { computedStyle, tokens: [], slotOccupants: [] };
        });
        return () => { try {
            dispose?.();
        }
        catch { } };
    });
}
exports.default = { inject: exports.inject, apply };
};
var __cache = {};
function __localRequire(id) {
  if (id.charCodeAt(0) !== 46) return require(id);
  id = id.slice(2);
  var cached = __cache[id];
  if (cached) return cached.exports;
  var module = { exports: {} };
  __cache[id] = module;
  __modules[id](__localRequire, module, module.exports);
  return module.exports;
}
var module = { exports: {} };
__modules["index.js"](__localRequire, module, module.exports);
return module.exports; } });
