import { ApolloError } from '@apollo/client';

import { guard } from '~/core/utils/typescript';

/**
 * Checks if the error is an ApolloError.
 *
 * @param {unknown} error - The error to check.
 * @return {boolean} True if the error is an ApolloError; otherwise, false.
 */
export const isApolloError = (error: unknown): boolean => {
    return guard<ApolloError>(error, ['graphQLErrors', 'networkError']);
};
