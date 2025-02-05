import { act } from 'react';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import Result, { err, ok } from 'true-myth/result';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { StringErrorCodes } from '~/core/constants/errors';
import useApolloError from '~/core/hooks/useApolloError';
import useToast from '~/core/hooks/useToast';
import { getStatusCode, handle400Error, handle500Error, isApolloError } from '~/core/utils/apolloError';
import { renderHook } from '~/vitest/utils';

// Mock dependencies
vi.mock('~/core/hooks/useToast');

vi.mock('react-auth-kit/hooks/useSignOut');

vi.mock('~/core/utils/apolloError', () => ({
    getStatusCode: vi.fn(),
    handle400Error: vi.fn(),
    handle500Error: vi.fn(),
    isApolloError: vi.fn(),
}));

describe('useApolloError', () => {
    let toastError: ReturnType<typeof vi.fn>;
    let signOutMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.useFakeTimers();
        toastError = vi.fn();
        signOutMock = vi.fn();

        vi.mocked(useToast).mockReturnValue({
            setToast: vi.fn(),
            toast: { error: toastError, info: vi.fn(), success: vi.fn(), warning: vi.fn() },
            toastMsg: { key: '1', msg: '', open: false, severity: 'info' },
        });
        vi.mocked(useSignOut).mockReturnValue(signOutMock);
        vi.mocked(getStatusCode).mockReset();
        vi.mocked(handle400Error).mockReset();
        vi.mocked(handle500Error).mockReset();
        vi.mocked(isApolloError).mockReset();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('handles Apollo errors with 400 status using handle400Error', () => {
        const fakeError = { message: 'fake error' };
        // Simulate an Apollo error with a 401 status code.
        (isApolloError as Mock).mockReturnValue(true);
        (getStatusCode as Mock).mockReturnValue(ok(401));
        const expectedResult = ok('handled 400');
        (handle400Error as Mock).mockReturnValue(expectedResult);

        const { result } = renderHook(() => useApolloError());
        let hookResult;
        act(() => {
            hookResult = result.current(fakeError, { options400: { someOption: true } as any });
        });

        expect(handle400Error).toHaveBeenCalledWith(fakeError, {
            redirectOn401: false,
            signOut: signOutMock,
            someOption: true,
        });
        expect(hookResult).toBe(expectedResult);
    });

    it('handles Apollo errors with 500 status using handle500Error and shows toast error', () => {
        const fakeError = { message: 'fake error' };
        const resetMock = vi.fn();
        (isApolloError as Mock).mockReturnValue(true);
        (getStatusCode as Mock).mockReturnValue(ok(500));
        const expectedResult = ok('handled 500');
        (handle500Error as Mock).mockReturnValue(expectedResult);

        const { result } = renderHook(() => useApolloError());
        let hookResult;
        act(() => {
            hookResult = result.current(fakeError, { reset: resetMock });
        });

        // Verify that the toast error is called with the message from handle500Error.
        expect(toastError).toHaveBeenCalledWith('handled 500');

        // Trigger the setTimeout callback.
        act(() => {
            vi.runAllTimers();
        });
        expect(resetMock).toHaveBeenCalled();
        expect(hookResult).toBe(expectedResult);
    });

    it('handles non-Apollo errors by showing unknown error toast and returning an error result', () => {
        const fakeError = { message: 'non-apollo error' };
        const resetMock = vi.fn();
        (isApolloError as Mock).mockReturnValue(false);

        const { result } = renderHook(() => useApolloError());
        let hookResult;
        act(() => {
            hookResult = result.current(fakeError, { reset: resetMock });
        });

        expect(toastError).toHaveBeenCalledWith(StringErrorCodes.Unknown);
        act(() => {
            vi.runAllTimers();
        });
        expect(resetMock).toHaveBeenCalled();
        expect(hookResult).toEqual(err(StringErrorCodes.Unknown));
    });
});
