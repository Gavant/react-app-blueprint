import { PaletteOptions } from '@mui/material/styles/createPalette';

const lightPalette: PaletteOptions = {
    error: {
        main: '#FF5252',
    },
    mode: 'light',
    primary: {
        main: '#2e7bd5',
    },
    secondary: {
        main: '#789DBC',
    },
};

const darkPalette: PaletteOptions = {
    error: {
        main: '#f44336',
    },
    mode: 'dark',
    primary: {
        main: '#90caf9',
    },
    secondary: {
        main: '#ce93d8',
    },
};

export { darkPalette, lightPalette };
