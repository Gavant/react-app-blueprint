import '@testing-library/jest-dom';
import { ThemeOptions } from '@mui/material';
import { ThemeProvider as MuiProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { render } from '@testing-library/react';
import { ReactElement } from 'react';
import { ThemeProvider as StyledProvider } from 'styled-components';

export function renderWithTheme(children: ReactElement, overrides?: ThemeOptions) {
    const theme = createTheme(overrides);
    return render(
        <MuiProvider theme={theme}>
            <StyledProvider theme={theme}>{children}</StyledProvider>
        </MuiProvider>
    );
}

export function resolveWithDelay<T>(result: T, delay = 1) {
    return new Promise<T>((resolve) => setTimeout(() => resolve(result), delay));
}

export function resolveWithReject<T>(result: T, delay = 1) {
    return new Promise<T>((resolve, reject) => setTimeout(() => reject(result), delay));
}
