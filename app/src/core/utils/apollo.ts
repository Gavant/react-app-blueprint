import { guard } from '~/core/utils/typescript';

import { ApolloError } from '@apollo/client';

/**
 * Checks if the error is an ApolloError
 *
 * @param {unknown} error
 * @return {*}  {error is ApolloError}
 */
export const isApolloError = (error: unknown): error is ApolloError => {
    return guard<ApolloError>(error, ['graphQLErrors', 'networkError']);
};
