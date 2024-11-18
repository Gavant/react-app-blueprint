import { PaletteOptions } from '@mui/material/styles/createPalette';

const lightPalette: PaletteOptions = {
    background: {
        default: '#ffffff',
        paper: '#f5f5f5',
    },
    mode: 'light',
    primary: {
        main: '#1976d2',
    },
    secondary: {
        main: '#dc004e',
    },
    text: {
        primary: '#000000',
        secondary: '#555555',
    },
};

const darkPalette: PaletteOptions = {
    background: {
        default: '#121212',
        paper: '#1d1d1d',
    },
    mode: 'dark',
    primary: {
        main: '#90caf9',
    },
    secondary: {
        main: '#f48fb1',
    },
    text: {
        primary: '#ffffff',
        secondary: '#bbbbbb',
    },
};

export { darkPalette, lightPalette };
