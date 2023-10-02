import type { CodegenConfig } from '@graphql-codegen/cli';

// TODO: Aspirational.
const config: CodegenConfig = {
    overwrite: true,
    schema: 'https://{{APP_NAME}}.s3.amazonaws.com/schema.graphql',
    documents: 'src/**/*.gql.ts',
    generates: {
        'src/core/types/generated/': {
            plugins: ['typescript', 'typescript-operations'],
        },
        'src/core/types/generated/graphql.schema.json': {
            plugins: ['introspection'],
        },
    },
};

export default config;
