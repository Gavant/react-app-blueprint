import { ApolloError } from '@apollo/client';
import { describe, expect, it, vi } from 'vitest';

import {
    GetErrorMessageForStringCode,
    getStatusCode,
    handle400Error,
    handle500Error,
    isApolloError,
    isApolloServerError,
    isCodeA400Error,
    isCodeInHTTPErrorCodes,
    TryGetApolloErrorEntity,
    TryGetApolloErrorResponseMessage,
} from '../apolloError';

import { StatusCodes, StringErrorCodes } from '~/core/constants/errors';

// Helper to simulate a Result<T, E> matching function
export function matchResult<T, E>(
    result: { match: <A>(patterns: { Err: (error: E) => A; Ok: (value: T) => A }) => A },
    ok: (value: T) => void,
    err: (error: E) => void
) {
    result.match({
        Err: (error) => {
            err(error);
            return undefined as unknown as void;
        },
        Ok: (value) => {
            ok(value);
            return undefined as unknown as void;
        },
    });
}

describe('apolloError utilities', () => {
    it('isApolloError returns true for an object with graphQLErrors and networkError', () => {
        const error = { graphQLErrors: [], networkError: {} };
        expect(isApolloError(error)).toBe(true);
    });

    it('isApolloError returns false for an object missing required properties', () => {
        const error = {};
        expect(isApolloError(error)).toBe(false);
    });

    it('isApolloServerError returns true when the networkError has a statusCode property', () => {
        const serverError = { statusCode: 400 };
        expect(isApolloServerError(serverError)).toBe(true);
    });

    it('isApolloServerError returns false when the networkError does not have a statusCode property', () => {
        const serverError = { message: 'Error' };
        expect(isApolloServerError(serverError)).toBe(false);
    });

    it('GetErrorMessageForStringCode returns the correct message from StringErrorCodes', () => {
        const testCode = 'TEST_CODE';
        (StringErrorCodes as Record<string, string>)[testCode] = 'Test error message';
        expect(GetErrorMessageForStringCode(testCode)).toBe('Test error message');
    });

    it('TryGetApolloErrorResponseMessage returns ok result with network error message for valid server error', () => {
        const networkError = {
            message: 'Network failure',
            name: 'ServerError',
            result: { errors: [{ message: 'Network failure' }] },
            statusCode: 500,
        };
        const apolloError = new ApolloError({ networkError });
        const result = TryGetApolloErrorResponseMessage(apolloError);
        matchResult(
            result,
            (msg) => expect(msg).toBe('Network failure'),
            (err) => expect(true).toBe(false)
        );
    });

    it('TryGetApolloErrorResponseMessage returns an err result when networkError is not a server error', () => {
        const networkError = { message: 'Non-server error', name: 'Error' };
        const apolloError = new ApolloError({ networkError });
        const result = TryGetApolloErrorResponseMessage(apolloError);
        matchResult(
            result,
            () => expect(true).toBe(false),
            (error) => expect(error).toBe(apolloError)
        );
    });

    it('TryGetApolloErrorEntity returns the entity when provided in extensions', () => {
        const networkError = {
            message: 'Error',
            name: 'Error',
            result: { errors: [{ extensions: { entity: 'MyEntity' } }] },
            statusCode: 400,
        };
        const apolloError = new ApolloError({ networkError });
        expect(TryGetApolloErrorEntity(apolloError)).toBe('MyEntity');
    });

    it('TryGetApolloErrorEntity returns null when no entity is provided', () => {
        const networkError = {
            message: 'Error',
            name: 'Error',
            result: { errors: [{ message: 'No entity here' }] },
            statusCode: 400,
        };
        const apolloError = new ApolloError({ networkError });
        expect(TryGetApolloErrorEntity(apolloError)).toBe(null);
    });

    it('isCodeInHTTPErrorCodes returns true for valid status codes', () => {
        expect(isCodeInHTTPErrorCodes(StatusCodes.Unauthorized)).toBe(true);
    });

    it('isCodeA400Error correctly identifies 400-level error codes', () => {
        expect(isCodeA400Error(400)).toBe(true);
        expect(isCodeA400Error(500)).toBe(false);
    });

    it('getStatusCode returns ok result for a valid status code from networkError', () => {
        const networkError = { message: 'Bad Request', name: 'Error', statusCode: StatusCodes.BadRequest };
        const apolloError = new ApolloError({ networkError });
        const result = getStatusCode(apolloError);
        matchResult(
            result,
            (code) => expect(code).toBe(StatusCodes.BadRequest),
            () => expect(true).toBe(false)
        );
    });

    it('getStatusCode returns err result for an invalid status code', () => {
        const networkError = { message: 'Invalid', name: 'Error', statusCode: 999 };
        const apolloError = new ApolloError({ networkError });
        const result = getStatusCode(apolloError);
        matchResult(
            result,
            () => expect(true).toBe(false),
            (error) => expect(error).toBe(apolloError)
        );
    });

    it('handle400Error returns the TryGetApolloErrorResponseMessage result when entity is Stripe', () => {
        const networkError = {
            message: 'Stripe error',
            name: 'Error',
            result: { errors: [{ extensions: { entity: 'Stripe' }, message: 'Stripe error' }] },
            statusCode: 400,
        };
        const apolloError = new ApolloError({ networkError });
        const result = handle400Error(apolloError);
        matchResult(
            result,
            (msg) => expect(msg).toBe('Stripe error'),
            () => expect(true).toBe(false)
        );
    });

    it('handle400Error calls signOut and returns "Unauthorized" for 401 errors when redirectOn401 is true', () => {
        const networkError = { message: 'Unauthorized access', name: 'Error', statusCode: StatusCodes.Unauthorized };
        const apolloError = new ApolloError({ networkError });
        const signOut = vi.fn();

        // Set window.location.pathname to simulate current location not on '/login'
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { pathname: '/dashboard' },
        });

        const result = handle400Error(apolloError, { redirectOn401: true, signOut });
        matchResult(
            result,
            (msg) => {
                expect(msg).toBe('Unauthorized');
                expect(signOut).toHaveBeenCalled();
            },
            () => expect(true).toBe(false)
        );
    });

    it('handle500Error returns the custom string when a handler is provided for code 500', () => {
        const networkError = { message: 'Server error', name: 'Error', statusCode: 500 };
        const apolloError = new ApolloError({ networkError });
        const customHandler = { 500: () => 'Custom server error' };
        const result = handle500Error(apolloError, customHandler);
        matchResult(
            result,
            (msg) => expect(msg).toBe('Custom server error'),
            () => expect(true).toBe(false)
        );
    });

    it('handle500Error returns the network error message when no custom handler is provided', () => {
        const networkError = { message: 'Server error', name: 'Error', statusCode: 500 };
        const apolloError = new ApolloError({ networkError });
        const result = handle500Error(apolloError);
        matchResult(
            result,
            (msg) => expect(msg).toBe('Server error'),
            () => expect(true).toBe(false)
        );
    });
});
