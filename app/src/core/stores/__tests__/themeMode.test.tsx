import { useMediaQuery } from '@mui/material';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ThemeMode, { ColorModeContext } from '../themeMode';

import { getLocalStorageEnvironmentVariable } from '~/core/utils/localStorage';
import { render, screen } from '~/vitest/utils';

// Mock dependencies
vi.mock('@mui/material', async () => {
    const actual = await vi.importActual('@mui/material');
    return {
        ...actual,
        useMediaQuery: vi.fn(),
    };
});

vi.mock('~/core/utils/localStorage', () => ({
    getLocalStorageEnvironmentVariable: vi.fn(),
}));

describe('ThemeMode', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('uses light theme by default when no stored mode and no dark mode preference', () => {
        vi.mocked(useMediaQuery).mockReturnValue(false);
        vi.mocked(getLocalStorageEnvironmentVariable).mockReturnValue(null);

        render(
            <ThemeMode>
                <ColorModeContext.Consumer>{({ mode }) => <div data-testid="theme-mode">{mode}</div>}</ColorModeContext.Consumer>
            </ThemeMode>
        );

        expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
    });

    it('uses dark theme when system prefers dark mode and no stored preference', () => {
        vi.mocked(useMediaQuery).mockReturnValue(true);
        vi.mocked(getLocalStorageEnvironmentVariable).mockReturnValue(null);

        render(
            <ThemeMode>
                <ColorModeContext.Consumer>{({ mode }) => <div data-testid="theme-mode">{mode}</div>}</ColorModeContext.Consumer>
            </ThemeMode>
        );

        expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
    });

    it('uses stored theme preference over system preference', () => {
        vi.mocked(useMediaQuery).mockReturnValue(true);
        vi.mocked(getLocalStorageEnvironmentVariable).mockReturnValue('light');

        render(
            <ThemeMode>
                <ColorModeContext.Consumer>{({ mode }) => <div data-testid="theme-mode">{mode}</div>}</ColorModeContext.Consumer>
            </ThemeMode>
        );

        expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
    });

    it('toggles theme mode when toggleColorMode is called', async () => {
        const user = userEvent.setup();
        vi.mocked(useMediaQuery).mockReturnValue(false);
        vi.mocked(getLocalStorageEnvironmentVariable).mockReturnValue(null);

        render(
            <ThemeMode>
                <ColorModeContext.Consumer>
                    {({ mode, toggleColorMode }) => (
                        <div>
                            <div data-testid="theme-mode">{mode}</div>
                            <button onClick={() => toggleColorMode()}>Toggle</button>
                        </div>
                    )}
                </ColorModeContext.Consumer>
            </ThemeMode>
        );

        expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');

        await user.click(screen.getByRole('button'));

        expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
        expect(localStorage.getItem('VITE_THEME_STORAGE_KEY')).toBe('dark');

        await act(async () => {
            await screen.getByRole('button').click();
        });

        expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
        expect(localStorage.getItem('VITE_THEME_STORAGE_KEY')).toBe('light');
    });
});
