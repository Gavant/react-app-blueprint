import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    generates: {
        'src/core/types/generated/graphql.schema.json': {
            documents: 'src/**/!(*.strapi).gql.ts',
            plugins: ['introspection'],
            schema: process.env.SCHEMA_PATH || 'SOME-FALLBACK-PATH',
        },
    },
    overwrite: true,
};

export default config;
