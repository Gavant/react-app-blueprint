import { ThemeProvider as MuiProvider, useMediaQuery } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import * as React from 'react';
import { ReactElement, ReactNode, useState } from 'react';
import { ThemeProvider as StyledProvider } from 'styled-components';

import { darkPalette, lightPalette } from '~/core/constants/palette';
import ThemeOverrides from '~/core/constants/theme';
import { getLocalStorageEnvironmentVariable } from '~/core/utils/localStorage';

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

interface ProviderToggleProps {
    children: ReactElement | ReactNode;
}

export default function ThemeMode({ children }: ProviderToggleProps) {
    const storedMode = getLocalStorageEnvironmentVariable('VITE_THEME_STORAGE_KEY');
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    let defaultMode: Mode = storedMode ?? 'light';
    if (!storedMode) {
        if (prefersDarkMode) {
            defaultMode = 'dark';
        }
    }

    const [mode, setMode] = useState<Mode>(defaultMode);

    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    localStorage.setItem('VITE_THEME_STORAGE_KEY', prevMode === 'light' ? 'dark' : 'light');
                    return prevMode === 'light' ? 'dark' : 'light';
                });
            },
        }),
        []
    );

    const theme = React.useMemo(() => {
        const theme = mode === 'light' ? lightPalette : darkPalette;
        const { overrides } = ThemeOverrides;

        return createTheme({
            palette: {
                ...theme,
            },
            sizing: (factor: number) => `${factor * 8}px`,
            typography: { ...overrides.typography },
        });
    }, [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <MuiProvider theme={theme}>
                <StyledProvider theme={theme}>{children}</StyledProvider>
            </MuiProvider>
        </ColorModeContext.Provider>
    );
}
