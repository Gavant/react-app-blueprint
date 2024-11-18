import { ThemeProvider as MuiProvider, useMediaQuery } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import { ThemeProvider as StyledProvider } from 'styled-components';

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
    // const [mode, setMode] = React.useState<Mode>(defaultTheme);
    // const colorMode = React.useMemo(
    //     () => ({
    //         toggleColorMode: () => {
    //             setMode((prevMode) => {
    //                 localStorage.setItem('VITE_THEME_STORAGE_KEY', prevMode === 'light' ? 'dark' : 'light');
    //                 return prevMode === 'light' ? 'dark' : 'light';
    //             });
    //         },
    //     }),
    //     []
    // );

    const theme = React.useMemo(() => {
        return createTheme({
            colorSchemes: {
                dark: true,
            },
        });
    }, []);

    return (
        // <ColorModeContext.Provider value={colorMode}>

        // </ColorModeContext.Provider>
        <MuiProvider defaultMode={defaultMode} theme={theme}>
            <StyledProvider theme={theme}>{children}</StyledProvider>
        </MuiProvider>
    );
}
