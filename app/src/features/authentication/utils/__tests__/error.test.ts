import { ApolloError } from '@apollo/client';
import { err, ok } from 'true-myth/result';
import { describe, expect, it, vi } from 'vitest';

import { handleApolloAuthError } from '../error';

import { StatusCodeType } from '~/core/constants/errors';
import { Toast } from '~/core/stores/toastContext';
import * as apolloErrorUtils from '~/core/utils/apolloError';

describe('handleApolloAuthError', () => {
    const navigate = vi.fn();
    const toast: Toast = {
        error: vi.fn(),
        info: vi.fn(),
        success: vi.fn(),
        warning: vi.fn(),
    };
    const username = 'testuser';
    const password = 'testpassword';

    const state = { navigate, password, toast, username };

    it('should handle 400 error', () => {
        const error = new ApolloError({ graphQLErrors: [], networkError: null });
        vi.spyOn(apolloErrorUtils, 'getStatusCode').mockReturnValue(ok(400 as StatusCodeType));
        vi.spyOn(apolloErrorUtils, 'handle400Error').mockReturnValue(ok('400 error handled'));

        const result = handleApolloAuthError(error, state);

        expect(result.isOk).toBe(true);
        expect(result.unwrapOr('')).toBe('400 error handled');
    });

    it('should handle 500 error', () => {
        const error = new ApolloError({ graphQLErrors: [], networkError: null });
        vi.spyOn(apolloErrorUtils, 'getStatusCode').mockReturnValue(ok(500 as StatusCodeType));
        vi.spyOn(apolloErrorUtils, 'handle500Error').mockReturnValue(ok('500 error handled'));

        const result = handleApolloAuthError(error, state);

        expect(result.isOk).toBe(true);
        expect(result.unwrapOr('')).toBe('500 error handled');
    });

    it('should handle unknown error', () => {
        const error = new ApolloError({ graphQLErrors: [], networkError: null });
        vi.spyOn(apolloErrorUtils, 'getStatusCode').mockReturnValue(err(error));

        const result = handleApolloAuthError(error, state);

        expect(result.isErr).toBe(true);
    });
});
