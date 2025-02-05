import { createTheme, ThemeProvider } from '@mui/material/styles';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import useMode from '../useMode';

describe('useMode', () => {
    it('should return "dark" when theme.palette.mode is dark', () => {
        const theme = createTheme({
            palette: { mode: 'dark' },
            sizing: 8,
        });
        const wrapper = ({ children }: { children: React.ReactNode }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;
        const { result } = renderHook(() => useMode(), { wrapper });
        expect(result.current).toBe('dark');
    });

    it('should return "light" when theme.palette.mode is light', () => {
        const theme = createTheme({
            palette: { mode: 'light' },
            sizing: 8,
        });
        const wrapper = ({ children }: { children: React.ReactNode }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;
        const { result } = renderHook(() => useMode(), { wrapper });
        expect(result.current).toBe('light');
    });
});
