/// <reference types="vite/client" />

type Mode = 'dark' | 'light';

type MyTablePropsArray = Array<keyof ImportMetaEnv>;

interface ImportMetaEnv {
    VITE_THEME_STORAGE_KEY: Mode | null;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
