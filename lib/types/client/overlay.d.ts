import * as React from 'react';
export declare function OverlayToolbar({ onCapture, onInspect, onIsolate, }: {
    onCapture?: () => void;
    onInspect?: () => void;
    onIsolate?: () => void;
}): React.ReactElement<{
    ref: any;
    className: string;
    style: React.CSSProperties;
    role: string;
    'aria-label': string;
    'aria-orientation': string;
}, string | React.JSXElementConstructor<any>>;
export declare function Overlay(): React.FunctionComponentElement<{
    onCapture?: () => void;
    onInspect?: () => void;
    onIsolate?: () => void;
}>;
//# sourceMappingURL=overlay.d.ts.map