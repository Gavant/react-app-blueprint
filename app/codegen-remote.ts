import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    generates: {
        'src/core/types/generated/graphql.schema.json': {
            documents: 'src/**/*.gql.ts',
            plugins: ['introspection'],
            schema: process.env.SCHEMA_PATH || 'SOME-FALLBACK-PATH',
        },
        'src/core/types/generated/graphql.ts': {
            documents: 'src/**/*.gql.ts',
            plugins: ['typescript', 'typescript-operations'],
            schema: process.env.SCHEMA_PATH || 'SOME-FALLBACK-PATH',
        },
    },
    overwrite: true,
};

export default config;
