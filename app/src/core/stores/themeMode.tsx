import { ThemeProvider as MuiProvider, useMediaQuery } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { ReactElement, ReactNode, useMemo } from 'react';
import { ThemeProvider as StyledProvider } from 'styled-components';

import customTheme from '~/core/constants/theme';

export interface ProviderToggleProps {
    children: ReactElement | ReactNode;
}

export default function ThemeMode({ children }: ProviderToggleProps) {
    const theme = useMemo(() => {
        const { overrides } = customTheme;
        return createTheme({
            colorSchemes: {
                dark: true,
                light: true,
            },
            cssVariables: {
                colorSchemeSelector: 'class',
            },
            palette: {
                ...overrides.palette,
            },
            typography: { ...overrides.typography },
        });
    }, []);

    return (
        <MuiProvider theme={theme}>
            <StyledProvider theme={theme}>{children}</StyledProvider>
        </MuiProvider>
    );
}
