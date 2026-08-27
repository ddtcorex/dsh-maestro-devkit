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
        background: string;
        border: string;
        borderRadius: number;
        padding: number;
        display: "flex";
        gap: number;
    };
}, HTMLElement>;
export declare function Overlay(): React.FunctionComponentElement<{
    onCapture?: () => void;
    onInspect?: () => void;
}>;
//# sourceMappingURL=overlay.d.ts.map