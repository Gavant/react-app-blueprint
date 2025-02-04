import { act, useContext } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { WindowSizeContext, WindowSizeProvider } from '../windowSizeContext';

import { render, screen } from '~/vitest/utils';

describe('WindowSizeContext', () => {
    beforeEach(() => {
        // Use fake timers to control the debounce delay.
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    const TestComponent = () => {
        const { size } = useContext(WindowSizeContext)!;
        return (
            <div data-testid="size">
                {size.width}-{size.height}
            </div>
        );
    };

    it('initializes with current window dimensions after mount', () => {
        render(
            <WindowSizeProvider>
                <TestComponent />
            </WindowSizeProvider>
        );

        // Run all timers so that the debounced handler is executed.
        act(() => {
            vi.runAllTimers();
        });

        expect(screen.getByTestId('size')).toHaveTextContent(`${window.innerWidth}-${window.innerHeight}`);
    });

    it('updates window dimensions on resize event', () => {
        render(
            <WindowSizeProvider>
                <TestComponent />
            </WindowSizeProvider>
        );

        // Ensure initial size is updated from the default.
        act(() => {
            vi.runAllTimers();
        });

        const initialWidth = window.innerWidth;
        const initialHeight = window.innerHeight;

        // Set new window dimensions.
        const newWidth = initialWidth + 100;
        const newHeight = initialHeight + 100;
        // Update global window dimensions.
        window.innerWidth = newWidth;
        window.innerHeight = newHeight;

        // Fire resize event and advance timers to trigger debounced update.
        act(() => {
            window.dispatchEvent(new Event('resize'));
            vi.advanceTimersByTime(50);
        });

        expect(screen.getByTestId('size')).toHaveTextContent(`${newWidth}-${newHeight}`);
    });

    it('does not update state if dimensions remain the same', () => {
        render(
            <WindowSizeProvider>
                <TestComponent />
            </WindowSizeProvider>
        );

        act(() => {
            vi.runAllTimers();
        });

        const currentSizeText = screen.getByTestId('size').textContent;

        // Dispatch a resize event without changing dimensions.
        act(() => {
            window.dispatchEvent(new Event('resize'));
            vi.advanceTimersByTime(50);
        });

        expect(screen.getByTestId('size')).toHaveTextContent(currentSizeText!);
    });
});
