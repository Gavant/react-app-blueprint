import { NextLink, Observable, Operation } from '@apollo/client';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';

import ApolloClientProvider, { client, createErrorLink } from '../apollo';

import { RefreshContext } from '~/features/authentication/public/stores/refresh';
import { render, screen } from '~/vitest/utils';

// Tests for ApolloClientProvider
describe('ApolloClientProvider', () => {
    it('renders children and initializes Apollo Client', () => {
        const Child = () => <div data-testid="child">Child</div>;
        // Provide a dummy refreshToken function via RefreshContext.
        const refresh = { refreshToken: vi.fn().mockResolvedValue(true), subscribe: () => {}, unsubscribe: () => {} };

        render(
            <RefreshContext.Provider value={refresh}>
                <ApolloClientProvider>
                    <Child />
                </ApolloClientProvider>
            </RefreshContext.Provider>
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();
        // The exported client variable should be defined after rendering.
        expect(client).toBeDefined();
    });
});

// Tests for createErrorLink
describe('createErrorLink', () => {
    it('retries request on 401 error when refreshToken succeeds', async () => {
        // Mock refreshToken to succeed.
        const refreshToken = vi.fn().mockResolvedValue(true);
        const link = createErrorLink({ refreshToken });
        const operation = {
            extensions: {},
            getContext: () => {},
            operationName: 'test',
            query: {},
            setContext: () => {},
            variables: {},
        } as unknown as Operation;

        // Forward function that returns an error on the first call and a success on the second.
        let callCount = 0;
        const forward = vi.fn(() => {
            callCount++;
            return new Observable<string>((observer) => {
                if (callCount === 1) {
                    // Simulate a 401 network error on first call.
                    observer.error({ statusCode: 401 });
                } else {
                    // On retry, return a successful value.
                    observer.next('retried result');
                    observer.complete();
                }
            });
        }) as unknown as NextLink;

        let result: unknown;
        await act(async () => {
            await new Promise<void>((resolve) => {
                link.request(operation, forward)?.subscribe({
                    complete: resolve,
                    error: () => {},
                    next: (data) => {
                        result = data;
                    },
                });
            });
        });

        expect(refreshToken).toHaveBeenCalled();
        // forward is called twice: first to trigger error and then for the retry.
        expect(forward).toHaveBeenCalledTimes(2);
        expect(result).toEqual('retried result');
    });

    it('throws an error when token refresh fails on a 401 error', async () => {
        const refreshToken = vi.fn().mockResolvedValue(false);
        const link = createErrorLink({ refreshToken });
        const operation = {
            extensions: {},
            getContext: () => {},
            operationName: 'test',
            query: {},
            setContext: () => {},
            variables: {},
        } as unknown as Operation;

        // Forward always errors with a 401.
        const forward = vi.fn(
            () =>
                new Observable<string>((observer) => {
                    observer.error({ statusCode: 401 });
                })
        ) as unknown as NextLink;

        let errorResult: any;
        await act(async () => {
            await new Promise<void>((resolve) => {
                link.request(operation, forward)?.subscribe({
                    error: (err) => {
                        errorResult = err;
                        resolve();
                    },
                    next: () => {},
                });
            });
        });

        expect(refreshToken).toHaveBeenCalled();
        expect(errorResult).toBeInstanceOf(Error);
        expect(errorResult.message).toEqual("Couldn't automatically log in");
    });

    it('passes through non-401 errors without calling refreshToken', async () => {
        const refreshToken = vi.fn();
        const link = createErrorLink({ refreshToken });
        const operation = {
            extensions: {},
            getContext: () => {},
            operationName: 'test',
            query: {},
            setContext: () => {},
            variables: {},
        } as unknown as Operation;

        // For non-401 errors, the link simply forwards the operation.
        const forward = vi.fn(
            () =>
                new Observable<string>((observer) => {
                    observer.error({ statusCode: 500 });
                })
        ) as unknown as NextLink;

        let errorResult: any;
        await act(async () => {
            await new Promise<void>((resolve) => {
                link.request(operation, forward)?.subscribe({
                    error: (err) => {
                        errorResult = err;
                        resolve();
                    },
                    next: () => {},
                });
            });
        });

        expect(refreshToken).not.toHaveBeenCalled();
        expect(errorResult).toEqual({ statusCode: 500 });
    });
});
