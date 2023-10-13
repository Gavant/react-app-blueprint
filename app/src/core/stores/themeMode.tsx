import { ThemeProvider as MuiProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import { ThemeProvider as StyledProvider } from 'styled-components';

import customTheme from '~/core/constants/theme';
import { getLocalStorageEnvironmentVariable } from '~/core/utils/localStorage';

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

export interface ProviderToggleProps {
    children: ReactElement | ReactNode;
}

export default function ThemeMode({ children }: ProviderToggleProps) {
    const storedMode = getLocalStorageEnvironmentVariable('VITE_THEME_STORAGE_KEY');

    let defaultTheme: Mode = storedMode ?? 'light';
    if (!storedMode) {
        const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
        if (darkThemeMq.matches) {
            defaultTheme = 'dark';
        }
    }
    const [mode, setMode] = React.useState<Mode>(defaultTheme);
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
        const theme = mode === 'light' ? customTheme.light : customTheme.dark;
        return createTheme({
            palette: {
                mode,
                ...theme.palette,
            },
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
