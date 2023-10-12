import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    overwrite: true,
    schema: 'schema/schema.graphql',
    documents: 'src/**/*.gql.ts',
    generates: {
        'src/core/types/generated/graphql.ts': {
            plugins: ['typescript', 'typescript-operations'],
        },
        'src/core/types/generated/graphql.schema.json': {
            plugins: ['introspection'],
        },
    },
};

export default config;
