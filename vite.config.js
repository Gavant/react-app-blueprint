import path from 'node:path';

import react from '@vitejs/plugin-react';
import { run } from 'good-fences';

/// <reference types="vitest" />
import { defineConfig } from 'vite';

// https://vitejs.dev/config/

// KICK
const port = 5425;
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [
                    [
                        'babel-plugin-styled-components',
                        {
                            displayName: true,
                            fileName: true,
                            apply: 'serve',
                        },
                    ],
                ],
            },
        }),
        {
            name: 'HRM-fence-check',
            // TODO: This executes twice. Unsure how to fix it at present. Clearing logs for now.
            handleHotUpdate: async ({ modules, server }) => {
                run({
                    project: './tsconfig.json',
                    rootDir: './src',
                    progressBar: false,
                    looseRootFileDiscovery: true,
                    ignoreExternalFences: true,
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
        },
    ],
    resolve: {
        alias: {
            // eslint-disable-next-line no-undef
            '~': path.resolve(__dirname, 'src'),
        },
    },
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
    server: {
        port: port,
    },
    test: {
        globals: true,
        setupFiles: 'vitest/setup.ts',
        environment: 'jsdom',
    },
});
