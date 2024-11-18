import { Palette, PaletteOptions } from '@mui/material';
import { TypographyOptions } from '@mui/material/styles/createTypography';

// Official mui color theme tool: https://m2.material.io/inline-tools/color/
export const colors = {
    black: '#000000',
    gray: {
        50: '#FFFFFF',
        100: '#FAFAFA',
        200: '#F5F5F5',
        300: '#F0F0F0',
        400: '#DEDEDE',
        500: '#C2C2C2',
        600: '#979797',
        700: '#818181',
        800: '#606060',
        900: '#3C3C3C',
    },
    white: '#FFFFFF',
} as const;

const palette: Partial<Palette> = {
    background: {
        default: colors.white,
        paper: colors.white,
    },
};

const fontFamilyPrimary = ['Poppins', 'sans-serif'].join(',');
const fontFamilySecondary = ['Nunito', 'sans-serif'].join(',');
const heading = (size: number) => ({
    color: colors.gray[900],
    fontFamily: fontFamilySecondary,
    fontSize: `${size}rem`,
    fontStyle: 'normal',
    fontWeight: 900,
    marginTop: 0,
});

export type ThemeCustomOverrideOptions = {
    palette: Partial<PaletteOptions>;
    typography: Partial<TypographyOptions>;
};

const overrides: ThemeCustomOverrideOptions = {
    palette,
    typography: {
        fontFamily: fontFamilyPrimary,

        h1: heading(2.25),
        h2: heading(2),
        h3: heading(1.75),
        h4: heading(1.5),
        h5: heading(1.25),
        h6: heading(1),
    },
};

const Options = {
    colors,
    overrides,
    palette,
};

export default Options;
