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
function OverlayToolbar({ onCapture, onInspect, onIsolate, }) {
    const btnBase = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 21,
        padding: '0 9px',
        borderRadius: 6,
        border: '1px solid var(--dsw-alias-border-l2)',
        background: 'var(--dsw-alias-bg-base)',
        color: 'var(--dsw-alias-label-primary)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
    };
    const hoverProps = {
        onMouseEnter: (e) => (e.currentTarget.style.background = 'var(--dsw-alias-interactive-bg-hover)'),
        onMouseLeave: (e) => (e.currentTarget.style.background = 'var(--dsw-alias-bg-base)'),
    };
    return React.createElement('div', {
        style: {
            position: 'fixed',
            top: 82,
            right: 12,
            zIndex: 9999,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 6px',
            borderRadius: 9,
            background: 'var(--dsw-alias-bg-base)',
            border: '1px solid var(--dsw-alias-border-l2)',
            boxShadow: 'var(--dsw-shadow-m, 0 4px 12px rgba(0,0,0,0.12))',
            color: 'var(--dsw-alias-label-primary)',
            font: 'var(--dsw-font-s-regular-10, 400 10px / 14px var(--dsw-font-family-base))',
        },
        role: 'toolbar',
        'aria-label': 'Maestro DevKit',
    }, React.createElement('button', { onClick: onCapture, style: btnBase, ...hoverProps }, 'Capture'), React.createElement('button', { onClick: onInspect, style: btnBase, ...hoverProps }, 'Inspect'), React.createElement('button', { onClick: onIsolate, style: btnBase, ...hoverProps }, 'Isolate'), React.createElement('span', { style: { color: 'var(--dsw-alias-label-secondary)', padding: '0 3px' } }, 'DevKit'));
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
function Sandbox({ slot, props, onPropsChange, }) {
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
    return React.createElement('div', { style: { padding: 16, border: '1px dashed #ccc', borderRadius: 8 } }, React.createElement('div', { style: { fontWeight: 700 } }, `Sandbox: ${slot}`), React.createElement('textarea', {
        value: text,
        onChange: (e) => setText(e.target.value),
        style: { width: '100%', minHeight: 160, fontFamily: 'monospace', fontSize: '0.85em', marginTop: 8 },
    }), React.createElement('button', { onClick: handleRerender, style: { marginTop: 8 } }, 'Re-render'), error ? React.createElement('div', { style: { color: 'crimson', marginTop: 4 } }, error) : null);
}
function SandboxContainer() {
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
function Inspector({ computedStyle, tokens }) {
    return React.createElement('div', { style: { padding: 12, background: '#fafafa', border: '1px solid #eee', borderRadius: 8 } }, React.createElement('div', null, `gap: ${computedStyle?.gap ?? '—'}`), React.createElement('div', null, `tokens: ${tokens?.length ?? 0}`));
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
            try {
                if (conn?.call)
                    return await conn.call('/dsh-maestro-devkit', { action });
                if (conn?.rpc?.call)
                    return await conn.rpc.call('/dsh-maestro-devkit', { action });
            }
            catch (e) {
                console.warn('[maestro-devkit] host call failed', e);
            }
        };
        const dispose = slots.inject('shell.overlay', () => slots.register({ name: 'shell.overlay', id: 'maestro-devkit-overlay', order: 100 }, () => {
            const [inspected, setInspected] = React.useState(null);
            return React.createElement(React.Fragment, null, React.createElement(overlay_js_1.OverlayToolbar, {
                onCapture: () => callHost('capture'),
                onInspect: async () => setInspected(await callHost('inspect')),
                onIsolate: () => {
                    const url = `/?__devkit_sandbox=${encodeURIComponent('layout:main')}&props=${encodeURIComponent('{}')}`;
                    window.open(url, '_blank');
                },
            }), inspected ? React.createElement(inspector_js_1.Inspector, { computedStyle: inspected.computedStyle, tokens: inspected.tokens }) : null);
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
