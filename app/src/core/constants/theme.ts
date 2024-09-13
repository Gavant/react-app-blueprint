import { createTheme } from '@mui/material/styles';
import { TypographyOptions } from '@mui/material/styles/createTypography';

const theme = createTheme();

export type ColorPalette = 'black' | 'error' | 'info' | 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'white';

const palette = {
    background: {
        default: '#FFF',
        paper: '#FFF',
    },
    black: theme.palette.augmentColor({
        color: {
            main: '#000',
        },
        name: 'black',
    }),
    error: theme.palette.augmentColor({
        color: {
            main: '#F82500',
        },
        name: 'error',
    }),
    facebook: theme.palette.augmentColor({
        color: {
            main: '#2669f6',
        },
        name: 'facebook',
    }),
    info: theme.palette.augmentColor({
        color: {
            main: '#001524',
        },
        name: 'info',
    }),
    neutral: theme.palette.augmentColor({
        color: {
            main: '#f4f1ea',
        },
        name: 'neutral',
    }),
    premium: theme.palette.augmentColor({
        color: {
            main: '#FFA14A',
        },
        name: 'premium',
    }),
    primary: theme.palette.augmentColor({
        color: {
            main: '#F04336',
        },
        name: 'primary',
    }),

    secondary: theme.palette.augmentColor({
        color: {
            main: '#15616D',
        },
        name: 'secondary',
    }),

    success: theme.palette.augmentColor({
        color: {
            main: '#86DBA6',
        },
        name: 'success',
    }),

    warning: theme.palette.augmentColor({
        color: {
            main: '#FF7D00',
        },
        name: 'warning',
    }),

    white: theme.palette.augmentColor({
        color: {
            main: '#FFF',
        },
        name: 'white',
    }),
};

// via https://m2.material.io/inline-tools/color/
export const color = {
    info: {
        100: '#bacbdc',
        200: '#95a8bc',
        300: '#6f869e',
        400: '#546e88',
        50: '#e1eaf8',
        500: '#395773',
        600: '#2d4b63',
        700: '#1f394f',
        800: '#11283a',
        900: '#001524', // 900 = info.main
    },
    premium: {
        100: '#ffe2be',
        200: '#ffd095',
        300: '#ffbd6e',
        400: '#ffae56',
        50: '#fff4e5',
        500: '#ffa14a', // premium
        600: '#fa9646',
        700: '#f28842',
        800: '#ea7a3f',
        900: '#dc663b',
    },
    primary: {
        100: '#fecdd2',
        200: '#ed9999',
        300: '#e27272',
        400: '#eb5250',
        50: '#feebee',
        500: '#f04236', // 500 = primary.main
        600: '#e13935',
        700: '#cf2f2f',
        800: '#c22828',
        900: '#b31d1c',
    },
    secondary: {
        100: '#b6ebfa',
        200: '#87def5',
        300: '#5bd0ef',
        400: '#40c6e8',
        50: '#e2f7fd',
        500: '#36bce1',
        600: '#30accd',
        700: '#2898b3',
        800: '#21849a',
        900: '#15616d', //900 = secondary.main
    },
};

const fontFamilyPrimary = ['Poppins', 'sans-serif'].join(',');
const fontFamilySecondary = ['Nunito', 'sans-serif'].join(',');
const heading = (size: number) => ({
    color: color.secondary[900],
    fontFamily: fontFamilySecondary,
    fontSize: `${size}rem`,
    fontStyle: 'normal',
    fontWeight: 900,
    marginTop: 0,
});

const overrides = {
    palette,
    typography: {
        blockquote: {
            color: color.info[800],
            fontSize: '1.25rem',
            fontStyle: 'italic',
            fontWeight: 600,
            lineHeight: 1.6,
        },
        button: {
            fontFamily: fontFamilySecondary,
            fontSize: '1.25rem',
            fontWeight: '800',
            letterSpacing: '0',
            lineHeight: '1',
            textTransform: 'capitalize',
        } as TypographyOptions['button'],
        fontFamily: fontFamilyPrimary,
        fontFamilySecondary,
        fontWeightExtraBold: 800,
        h1: heading(2.25),
        h2: heading(2),
        h3: heading(1.75),
        h4: heading(1.5),
        h5: heading(1.25),
        h6: heading(1),
    },
};

export default {
    color,
    overrides,
    palette,
};
