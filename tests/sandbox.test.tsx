/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import * as React from 'react';
import { Sandbox } from '../src/client/sandbox.js';

describe('Sandbox', () => {
  afterEach(() => cleanup());

  it('renders an editable JSON textarea seeded with the given props', () => {
    const { getByRole } = render(React.createElement(Sandbox, { slot: 'layout:main', props: { isOpen: true } }));
    const textarea = getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toContain('"isOpen": true');
  });

  it('calls onPropsChange with parsed JSON when Re-render is clicked', () => {
    const onPropsChange = vi.fn();
    const { getByRole } = render(
      React.createElement(Sandbox, { slot: 'layout:main', props: { isOpen: true }, onPropsChange }),
    );
    const textarea = getByRole('textbox') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '{"isOpen": false}' } });
    fireEvent.click(getByRole('button', { name: /re-render/i }));
    expect(onPropsChange).toHaveBeenCalledWith({ isOpen: false });
  });

  it('shows an inline error and does not call onPropsChange on invalid JSON', () => {
    const onPropsChange = vi.fn();
    const { getByRole, getByText } = render(
      React.createElement(Sandbox, { slot: 'layout:main', props: {}, onPropsChange }),
    );
    const textarea = getByRole('textbox') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '{not valid json' } });
    fireEvent.click(getByRole('button', { name: /re-render/i }));
    expect(onPropsChange).not.toHaveBeenCalled();
    expect(getByText(/invalid json/i)).toBeDefined();
  });
});
