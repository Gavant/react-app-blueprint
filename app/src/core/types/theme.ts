import { Theme } from '@mui/material/styles';

export default interface createSizing {
    (sizingInput?: SizingOptions, transform?: (() => undefined) | ((abs: number | string) => number | number) | Sizing): Sizing;
}
export interface Sizing {
    (): string;
    (value: SizingArgument): string;
    (width: SizingArgument, height: SizingArgument): string;
}
export type SizingArgument = number | string;

export type SizingOptions =
    | ((abs: number) => number | string)
    | ((abs: number | string) => number | string)
    | number
    | ReadonlyArray<number | string>
    | Sizing
    | string;

declare module '@mui/material/styles/createMixins' {
    interface Mixins {
        sizeMixin: CSSProperties;
    }
}

// export interface Sizing {
//     (): string;
//     (value: SizingArgument): string;
//     (width: SizingArgument): string;
//     (height: SizingArgument): string;
//     (width: SizingArgument, height: SizingArgument): string;
// }
// export type SizingArgument = number | string;

declare module '@mui/material/styles' {
    interface Theme {
        sizing: Sizing;
    }
    // allow configuration using `createTheme()`
    interface ThemeOptions {
        sizing: SizingOptions;
    }
}

declare module 'styled-components' {
    export interface DefaultTheme extends Theme {}
}
