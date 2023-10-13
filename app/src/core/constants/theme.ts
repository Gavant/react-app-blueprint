import { ThemeOptions } from '@mui/material';

export const lightTheme = {
    palette: {
        error: {
            main: '#bc3030',
        },
        info: {
            main: '#4e9ee2',
        },
        primary: {
            main: '#794fa7',
        },
        secondary: {
            main: '#ff8020',
        },
        success: {
            main: '#68db8f',
        },
        warning: {
            main: '#ffc300',
        },
    },
};

export const darkTheme: ThemeOptions = {
    palette: {
        error: {
            main: '#f56a6a',
        },
        info: {
            main: '#4e9ee2',
        },
        primary: {
            main: '#ae8ed2',
        },
        secondary: {
            main: '#af5109',
        },
        success: {
            main: '#68db8f',
        },
        warning: {
            main: '#ffc300',
        },
    },
};

export default {
    dark: darkTheme,
    light: lightTheme,
};
