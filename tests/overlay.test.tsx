/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import * as React from 'react';
import { OverlayToolbar } from '../src/client/overlay.js';

describe('OverlayToolbar', () => {
  afterEach(() => cleanup());

  it('exposes a Capture, Inspect, and Isolate button', () => {
    const { getByRole } = render(React.createElement(OverlayToolbar, {}));
    expect(getByRole('button', { name: 'Capture' })).toBeDefined();
    expect(getByRole('button', { name: 'Inspect' })).toBeDefined();
    expect(getByRole('button', { name: 'Isolate' })).toBeDefined();
  });

  it('calls onInspect when Inspect is clicked', () => {
    const onInspect = vi.fn();
    const { getByRole } = render(React.createElement(OverlayToolbar, { onInspect }));
    fireEvent.click(getByRole('button', { name: 'Inspect' }));
    expect(onInspect).toHaveBeenCalled();
  });

  it('calls onIsolate when Isolate is clicked', () => {
    const onIsolate = vi.fn();
    const { getByRole } = render(React.createElement(OverlayToolbar, { onIsolate }));
    fireEvent.click(getByRole('button', { name: 'Isolate' }));
    expect(onIsolate).toHaveBeenCalled();
  });
});
