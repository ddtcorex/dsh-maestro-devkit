import * as React from 'react';
export declare function OverlayToolbar({ onCapture, onInspect }: {
    onCapture?: () => void;
    onInspect?: () => void;
}): React.DetailedReactHTMLElement<{
    style: {
        position: "fixed";
        top: number;
        right: number;
        zIndex: number;
        display: "inline-flex";
        alignItems: "center";
        gap: number;
        padding: string;
        borderRadius: number;
        background: string;
        border: string;
        boxShadow: "var(--dsw-shadow-m, 0 4px 12px rgba(0,0,0,0.12))";
        color: "var(--dsw-alias-label-primary)";
        font: "var(--dsw-font-s-regular-13, 400 13px/20px var(--dsw-font-family-base))";
    };
    role: "toolbar";
    'aria-label': string;
}, HTMLElement>;
export declare function Overlay(): React.FunctionComponentElement<{
    onCapture?: () => void;
    onInspect?: () => void;
}>;
//# sourceMappingURL=overlay.d.ts.map