import Cookies from 'js-cookie';
import { act } from 'react';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useNavigate } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LOGIN, LOGOUT, REFRESH_TOKEN } from '~/features/authentication/graphql/authentication.gql';
import useAuth from '~/features/authentication/public/hooks/useAuth';
import { renderHook } from '~/vitest/utils';

// Mock dependencies
vi.mock('js-cookie');
vi.mock('react-router', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('react-auth-kit/hooks/useSignIn', () => ({
    default: vi.fn(),
}));

vi.mock('react-auth-kit/hooks/useSignOut', () => ({
    default: vi.fn(),
}));
vi.mock('react-auth-kit/hooks/useAuthHeader', () => ({
    default: () => 'mockAuthHeader',
}));
vi.mock('~/core/hooks/useToast', () => ({
    default: () => ({ toast: { error: vi.fn() } }),
}));

describe('useAuth', () => {
    const mockNavigate = vi.fn();
    const mockSetCookie = vi.fn();
    const mockRemoveCookie = vi.fn();
    const mockToastError = vi.fn();
    const mockUseSignIn = vi.fn();
    const mockUseSignOut = vi.fn();
    const mockGetCookie = vi.fn();

    beforeEach(() => {
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);
        vi.mocked(Cookies.set).mockImplementation(mockSetCookie);
        vi.mocked(Cookies.remove).mockImplementation(mockRemoveCookie);
        vi.mocked(Cookies.get).mockImplementation(mockGetCookie);
        vi.mocked(useSignIn).mockReturnValue(mockUseSignIn);
        vi.mocked(useSignOut).mockReturnValue(mockUseSignOut);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should sign in successfully', async () => {
        mockUseSignIn.mockReturnValue(true);
        const mocks = [
            {
                request: {
                    query: LOGIN,
                    variables: { input: { password: 'password', username: 'testuser' } },
                },
                result: {
                    data: {
                        login: {
                            AccessToken: 'mockAccessToken',
                            RefreshToken: 'mockRefreshToken',
                        },
                    },
                },
            },
        ];

        const { result } = renderHook(() => useAuth(), { mocks });

        await act(async () => {
            const signInResult = await result.current.authenticate.signIn('testuser', 'password');
            expect(signInResult.isOk).toBe(true);
        });

        expect(mockSetCookie).toHaveBeenCalledWith(undefined, 'mockRefreshToken', expect.any(Object));
        expect(mockSetCookie).toHaveBeenCalledWith(undefined, 'testuser', expect.any(Object));
    });

    it('should sign out successfully', async () => {
        const mocks = [
            {
                request: {
                    query: LOGOUT,
                    variables: { refreshToken: 'mockRefreshToken' },
                },
                result: {
                    data: {
                        logout: true,
                    },
                },
            },
        ];

        const { result } = renderHook(() => useAuth(), { mocks });

        await act(async () => {
            await result.current.invalidate.signOut();
        });

        expect(mockRemoveCookie).toHaveBeenCalledWith(undefined, expect.any(Object));
        expect(mockRemoveCookie).toHaveBeenCalledWith(undefined, expect.any(Object));
    });

    it('should refresh token successfully', async () => {
        mockGetCookie.mockReturnValue('mockRefreshToken');
        mockUseSignIn.mockReturnValue(true);
        const mocks = [
            {
                request: {
                    query: REFRESH_TOKEN,
                    variables: { refreshToken: 'mockRefreshToken' },
                },
                result: {
                    data: {
                        refreshToken: {
                            AccessToken: 'newMockAccessToken',
                        },
                    },
                },
            },
        ];

        const { result } = renderHook(() => useAuth(), { mocks });

        await act(async () => {
            const refreshResult = await result.current.renew.refresh();
            expect(refreshResult?.isOk).toBe(true);
        });
    });

    it('should handle sign in error', async () => {
        const mocks = [
            {
                error: new Error('Invalid credentials'),
                request: {
                    query: LOGIN,
                    variables: { input: { password: 'wrongpassword', username: 'testuser' } },
                },
            },
        ];

        const { result } = renderHook(() => useAuth(), { mocks });

        await act(async () => {
            const signInResult = await result.current.authenticate.signIn('testuser', 'wrongpassword');
            expect(signInResult.isErr).toBe(true);
        });
    });
});
