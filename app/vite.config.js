import path from 'node:path';

import react from '@vitejs/plugin-react';
import { run } from 'good-fences';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
/// <reference types="vitest" />

// https://vitejs.dev/config/

// KICK
const port = 5425;
export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        // return id.split("/node_modules/").pop()?.split("/")[0]; // if we want to chunk every individual module.
                        return 'vendor';
                    }
                },
            },
        },
    },
    plugins: [
        react({
            babel: {
                plugins: [
                    [
                        'babel-plugin-styled-components',
                        {
                            apply: 'serve',
                            displayName: true,
                            fileName: true,
                        },
                    ],
                ],
            },
        }),
        {
            // TODO: This executes twice. Unsure how to fix it at present. Clearing logs for now.
            handleHotUpdate: async ({ modules, server }) => {
                run({
                    ignoreExternalFences: true,
                    looseRootFileDiscovery: true,
                    progressBar: false,
                    project: './tsconfig.json',
                    rootDir: './src',
                }).then((result) => {
                    console.clear();
                    if (result.errors.length) {
                        console.error('𓊏 Violation in ...');
                        result?.errors?.forEach((error) => {
                            console.log(error.detailedMessage);
                        });
                    } else {
                        console.log(`Vite dev server running on port: ${port}`);
                    }
                });
                return modules;
            },
            name: 'HRM-fence-check',
        },
        tsconfigPaths(),
    ],
    resolve: {
        alias: {
            // eslint-disable-next-line no-undef
            '~': path.resolve(__dirname, 'src'),
        },
    },
    server: {
        port: port,
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: 'vitest/setup.ts',
    },
});
