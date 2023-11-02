import '@testing-library/jest-dom';
import { ThemeOptions } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { render } from '@testing-library/react';
import { ReactElement } from 'react';
import { ThemeProvider } from 'styled-components';

export function renderWithTheme(children: ReactElement, overrides?: ThemeOptions) {
    const theme = createTheme(overrides);
    return render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
}

export function resolveWithDelay<T>(result: T, delay = 1) {
    return new Promise<T>((resolve) => setTimeout(() => resolve(result), delay));
}

export function resolveWithReject<T>(result: T, delay = 1) {
    return new Promise<T>((resolve, reject) => setTimeout(() => reject(result), delay));
}
