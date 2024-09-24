import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    generates: {
        'src/core/types/generated/graphql.schema.json': {
            documents: 'src/**/*.gql.ts',
            plugins: ['introspection'],
            schema: 'schema/schema.graphql',
        },
    },
    overwrite: true,
};

export default config;
