import { useApolloClient, useMutation } from '@apollo/client';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useNavigate } from 'react-router';
import Result, { err, ok, unwrapOr } from 'true-myth/src/result';

import useToast from '~/core/hooks/useToast';
import {
    LoginMutation,
    LogoutMutation,
    MutationLoginArgs,
    MutationLogoutArgs,
    RefreshTokenMutation,
    RefreshTokenMutationVariables,
} from '~/core/types/generated/graphql';
import { isApolloError } from '~/core/utils/apolloError';
import { LOGIN, LOGOUT, REFRESH_TOKEN } from '~/features/authentication/graphql/authentication.gql';
import { handleApolloAuthError } from '~/features/authentication/utils/error';
import { createSessionData } from '~/features/authentication/utils/session';

const setHeaders = (auth: string) => ({ context: { headers: { token: `Bearer ${auth}` } } });

export interface IUserData {
    username: string;
}

let cookieDomain;

if (import.meta.env.DEV) {
    cookieDomain = 'localhost';
} else {
    cookieDomain = import.meta.env.VITE_AUTH_HOST_DOMAIN;
}

const cookieOpts = {
    domain: cookieDomain,
    expires: 30, // Days - Cognito refresh tokens default duration
};

export default function useAuth() {
    const login = useSignIn();
    const logout = useSignOut();
    const client = useApolloClient();

    const authHeader = useAuthHeader() ?? '';
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loginMutation, { error: loginError, loading: loginLoading, reset: resetLogin }] = useMutation<LoginMutation, MutationLoginArgs>(
        LOGIN
    );
    const [logoutMutation, { error: logoutError, loading: logoutLoading, reset: resetLogout }] = useMutation<
        LogoutMutation,
        MutationLogoutArgs
    >(LOGOUT);

    const [refreshMutation, { loading: refreshLoading }] = useMutation<RefreshTokenMutation, RefreshTokenMutationVariables>(REFRESH_TOKEN);

    useEffect(() => {
        if (loginError?.message) {
            if (!loginError?.message?.indexOf('401')) {
                toast.error(loginError.message);
            }
            resetLogin();
        }
    }, [loginError?.message, resetLogin, toast]);

    useEffect(() => {
        if (logoutError?.message) {
            toast.error(logoutError.message);
            resetLogout();
        }
    }, [logoutError?.message, resetLogout, toast]);

    const signIn = async (username: string, password: string): Promise<Result<{ password: string; username: string }, string>> => {
        try {
            const result = await loginMutation({ variables: { input: { password, username } } });
            const responseData = result?.data?.login ?? undefined;
            const sessionData = createSessionData(responseData, username);

            Cookies.set(import.meta.env.VITE_REFRESH_COOKIE_NAME, responseData?.RefreshToken ?? '', cookieOpts);
            Cookies.set(import.meta.env.VITE_USER_COOKIE_NAME, username, cookieOpts);

            const signIn = login(sessionData);
            return signIn ? ok({ password, username }) : err('`access_token` is missing in server response');
        } catch (error: unknown) {
            if (isApolloError(error)) {
                const errorContext = { navigate, password, toast, username };
                const result = handleApolloAuthError(error, errorContext);
                return err(unwrapOr('Unknown error occurred', result));
            } else {
                toast.error('Unknown error occurred');
                return err('Unknown error occurred');
            }
        }
    };

    const signOut = async (redirect?: string) => {
        try {
            const refreshToken = Cookies.get(import.meta.env.VITE_REFRESH_COOKIE_NAME);
            if (refreshToken) {
                await logoutMutation({ variables: { refreshToken }, ...setHeaders(authHeader) });
            }
            await client.resetStore(); // TODO: According to Apollo docs this is all we need. But haven't tested it completely.
        } finally {
            Cookies.remove(import.meta.env.VITE_REFRESH_COOKIE_NAME, cookieOpts);
            Cookies.remove(import.meta.env.VITE_USER_COOKIE_NAME, cookieOpts);
            logout();

            if (redirect) {
                window.location.href = `${window.location.origin}${redirect}`;
            } else {
                window.location.reload();
            }
        }
    };

    const refresh = async () => {
        const refreshToken = Cookies.get(import.meta.env.VITE_REFRESH_COOKIE_NAME);
        const username = Cookies.get(import.meta.env.VITE_USER_COOKIE_NAME) ?? '';
        if (refreshToken) {
            try {
                const result = await refreshMutation({
                    mutation: REFRESH_TOKEN,
                    variables: { refreshToken: refreshToken ?? '' },
                });
                const responseData = result?.data?.refreshToken ?? undefined;
                const sessionData = createSessionData(responseData, username);
                const signIn = login(sessionData);
                return signIn ? ok({ username }) : err('`access_token` is missing in server response');
            } catch (error: unknown) {
                console.log('Refresh error. See error below');
                console.log(error);
            }
        }
    };

    return {
        authenticate: {
            loading: loginLoading,
            signIn,
        },
        invalidate: {
            loading: logoutLoading,
            signOut,
        },
        renew: {
            loading: refreshLoading,
            refresh,
        },
    };
}
