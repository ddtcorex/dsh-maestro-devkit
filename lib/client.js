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
function OverlayToolbar({ onCapture, onInspect }) {
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
        font: 'var(--dsw-font-s-medium-14, 500 14px / 20px var(--dsw-font-family-base))',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
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
            font: 'var(--dsw-font-s-regular-14, 400 14px / 20px var(--dsw-font-family-base))',
        },
        role: 'toolbar',
        'aria-label': 'Maestro DevKit',
    }, React.createElement('button', {
        onClick: onCapture,
        style: btnBase,
        onMouseEnter: (e) => (e.currentTarget.style.background = 'var(--dsw-alias-interactive-bg-hover)'),
        onMouseLeave: (e) => (e.currentTarget.style.background = 'var(--dsw-alias-bg-base)'),
    }, 'Capture'), React.createElement('button', {
        onClick: onInspect,
        style: btnBase,
        onMouseEnter: (e) => (e.currentTarget.style.background = 'var(--dsw-alias-interactive-bg-hover)'),
        onMouseLeave: (e) => (e.currentTarget.style.background = 'var(--dsw-alias-bg-base)'),
    }, 'Inspect'), React.createElement('span', { style: { color: 'var(--dsw-alias-label-secondary)', font: 'var(--dsw-font-s-regular-14, 400 14px / 20px var(--dsw-font-family-base))', padding: '0 3px' } }, 'DevKit'));
}
function Overlay() {
    return React.createElement(OverlayToolbar, {});
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
/**
 * dsh-maestro-devkit — client half
 * Overlay + inspector + sandbox slots.
 * Uses ctx.get('slots') pattern (no direct ctx.slots) to avoid
 * "cannot get property slots without inject" when inject metadata is
 * not yet propagated. Safe early-return if slots unavailable.
 */
exports.inject = ['slots'];
function apply(ctx) {
    ctx.effect(() => {
        const slots = ctx.slots ?? ctx.get?.('slots');
        if (!slots?.inject || !slots?.register)
            return () => { };
        const dispose = slots.inject('shell.overlay', () => slots.register({ name: 'shell.overlay', id: 'maestro-devkit-overlay', order: 100 }, () => React.createElement(overlay_js_1.OverlayToolbar, {})));
        return () => {
            try {
                dispose?.();
            }
            catch { }
        };
    });
    // Ensure client bundle is not empty
    ctx.effect(() => {
        return () => { };
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
