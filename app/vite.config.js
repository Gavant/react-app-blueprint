import path from 'node:path';

import { reactRouter } from '@react-router/dev/vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// eslint-disable-next-line import/extensions
import { dependencies } from './package.json';

/// <reference types="vitest" />

const reactDeps = Object.keys(dependencies).filter((key) => key === 'react' || key.startsWith('react-'));

/**
 * ModeConfig
 * @typedef {{development: any, candidate: any, production: any, staging: any, production_debug: any}} ModeConfig
 */

/**
 * Mode configuration function:
 * Returns configuration setting for the passed in `mode` argument. Defaults to production if no `mode` is provided
 *
 * @param {string} mode - The vite build mode
 * @return {function(ModeConfig): void} - The configuration function
 *
 * @example
 *
 *     modeConfig('development')({ development: true, candidate: true, production: false }) ==== true;
 * @example
 *
 *     modeConfig()({ development: someChunkingFunction, production: aProdChunkingFunction }) ==== () => aProdChunkingFunction;
 */
const modeConfig = (mode) => (modeConfig) => {
    return modeConfig[mode ?? 'production'] ?? modeConfig['production'] ?? null;
};

// React router 7 migration: Currently stalled on https://github.com/remix-run/react-router/issues/12641

export default defineConfig(({ mode }) => {
    const setModeConfig = modeConfig(mode);
    return {
        build: {
            commonjsOptions: {
                transformMixedEsModules: true,
            },
            minify: setModeConfig({
                candidate: false,
                development: false,
                production: true,
                production_debug: false,
                staging: false,
            }),
            rollupOptions: {
                output: {
                    manualChunks: setModeConfig({
                        candidate: () => {},
                        development: () => {},
                        production: () => ({
                            vendor: reactDeps,
                            ...Object.keys(dependencies).reduce((chunks, name) => {
                                if (!reactDeps.includes(name)) {
                                    chunks[name] = [name];
                                }
                                return chunks;
                            }, {}),
                        }),
                        production_debug: () => {},
                        staging: () => {},
                    }),
                },
            },
        },
        define: {
            'globalThis.__DEV__': JSON.stringify(
                setModeConfig({ candidate: true, development: true, production: false, production_debug: true, staging: true })
            ),
        },
        esbuild: {
            drop: setModeConfig({ candidate: [], development: [], production: ['console', 'debugger'], production_debug: [], staging: [] }),
        },
        optimizeDeps: {
            include: ['lottie-web'],
        },
        plugins: [
            nodePolyfills({ include: ['crypto'] }),
            reactRouter({
                babel: {
                    plugins: [
                        [
                            'babel-plugin-styled-components',
                            {
                                apply: 'serve',
                                displayName: setModeConfig({
                                    candidate: true,
                                    development: true,
                                    production: false,
                                    production_debug: true,
                                    staging: true,
                                }),
                                fileName: true,
                            },
                        ],
                    ],
                },
            }),
            ...setModeConfig({
                candidate: [],
                development: [],
                production: [],
                production_debug: [
                    visualizer({
                        filename: 'bundle_visualizer.html',
                    }),
                ],
                staging: [],
            }),
        ],
        resolve: {
            alias: {
                '@mui/material/utils': '@mui/material/node/utils',
                '~': path.resolve(__dirname, 'src'),
            },
        },
        server: {
            port: 5173,
        },
        ssr: false,
        test: {
            css: true,
            disableConsoleIntercept: true,
            environment: 'jsdom',
            globals: true,
            reporters: ['default'],
            setupFiles: 'src/vitest/setup.ts',
            silent: false,
        },
    };
});
