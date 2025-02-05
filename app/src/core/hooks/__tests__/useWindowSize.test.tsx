import { createTheme, ThemeProvider } from '@mui/material/styles';
import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import useWindowSize from '../useWindowSize';

import { WindowSizeContext } from '~/core/stores/windowSizeContext';

describe('useWindowSize', () => {
    // Create a theme with a custom md breakpoint
    const theme = createTheme({ breakpoints: { values: { lg: 1200, md: 768, sm: 600, xl: 1536, xs: 0 } }, sizing: 8 });

    const createWrapper = (width: number): React.FC<{ children: ReactNode }> => {
        const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
            <ThemeProvider theme={theme}>
                <WindowSizeContext.Provider value={{ size: { height: 800, width } }}>{children}</WindowSizeContext.Provider>
            </ThemeProvider>
        );
        Wrapper.displayName = `WindowSizeProviderWrapper_${width}`;
        return Wrapper;
    };

    it('should return desktop values when width is greater than or equal to md breakpoint', () => {
        const { result } = renderHook(() => useWindowSize(), {
            wrapper: createWrapper(1024),
        });

        expect(result.current.isDesktop).toBe(true);
        expect(result.current.isMobile).toBe(false);
        expect(result.current.size.width).toBe(1024);
    });

    it('should return mobile values when width is less than md breakpoint', () => {
        const { result } = renderHook(() => useWindowSize(), {
            wrapper: createWrapper(500),
        });

        expect(result.current.isDesktop).toBe(false);
        expect(result.current.isMobile).toBe(true);
        expect(result.current.size.width).toBe(500);
    });

    it('should throw an error when used outside of WindowSizeProvider', () => {
        // Custom wrapper that only provides theme but not the WindowSizeContext
        const CustomWrapper: React.FC<{ children: ReactNode }> = ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;
        expect(() =>
            renderHook(() => useWindowSize(), {
                wrapper: CustomWrapper,
            })
        ).toThrowError(new Error('useWindowSize must be used within a WindowSizeProvider'));
    });
});
