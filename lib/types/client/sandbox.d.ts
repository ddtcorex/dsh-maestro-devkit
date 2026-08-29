import * as React from 'react';
export declare function Sandbox({ slot, props, onPropsChange, }: {
    slot: string;
    props?: any;
    onPropsChange?: (next: any) => void;
}): React.DetailedReactHTMLElement<{
    style: {
        padding: number;
        border: string;
        borderRadius: number;
    };
}, HTMLElement>;
export declare function SandboxContainer(): React.FunctionComponentElement<{
    slot: string;
    props?: any;
    onPropsChange?: (next: any) => void;
}>;
//# sourceMappingURL=sandbox.d.ts.map