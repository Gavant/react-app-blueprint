import path from 'node:path';

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

export default defineConfig(({ mode }) => {
    const setModeConfig = modeConfig(mode);
    return {
        build: {
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
        plugins: [
            nodePolyfills(),
            react({
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
                // eslint-disable-next-line no-undef
                '~': path.resolve(__dirname, 'src'),
            },
        },
        server: {
            port: 5173,
        },
        test: {
            coverage: {
                reporter: ['json-summary'],
            },
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
