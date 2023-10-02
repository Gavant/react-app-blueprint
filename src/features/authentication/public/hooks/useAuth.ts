import { useContext, useEffect } from 'react';
import { useAuthHeader, useSignIn, useSignOut } from 'react-auth-kit';
import AuthContext from 'react-auth-kit/dist/AuthContext';
import { signInFunctionParams } from 'react-auth-kit/dist/types';

import { Result } from 'true-myth';
import { err, ok } from 'true-myth/result';
import useToast from '~/core/hooks/useToast';
import { LoginAuthenticationResult, MutationLoginArgs, MutationLogoutArgs } from '~/core/types/generated/graphql';
import { isApolloError } from '~/core/utils/apollo';
import { LOGIN, LOGOUT } from '~/features/authentication/public/graphql/authentication';

import { useMutation } from '@apollo/client';

const setHeaders = (auth: string) => ({ context: { headers: { token: `Bearer ${auth}` } } });

export default function useAuth() {
    const login = useSignIn();
    const logout = useSignOut();
    const getAuth = useAuthHeader();
    const { toast } = useToast();
    const authContext = useContext(AuthContext);
    // TODO: GQL Codegen just suddenly started omitting my LoginMutation type. Swapping to any for now.
    const [loginMutation, { error: loginError, loading: loginLoading, reset: resetLogin }] = useMutation<any, MutationLoginArgs>(LOGIN, {
        fetchPolicy: 'no-cache',
    });
    // TODO: GQL Codegen just suddenly started omitting my LogoutMutation type. Swapping to any for now.
    const [logoutMutation, { error: logoutError, loading: logoutLoading, reset: resetLogout }] = useMutation<any, MutationLogoutArgs>(
        LOGOUT,
        {
            fetchPolicy: 'no-cache',
        }
    );

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

    const signIn = async (username: string, password: string): Promise<Result<boolean, { reason: string }>> => {
        try {
            const result = await loginMutation({ variables: { input: { password, username } } });
            const responseData = (result?.data?.login as LoginAuthenticationResult) ?? undefined;
            const sessionData: signInFunctionParams = {
                authState: { username },
                expiresIn: responseData?.ExpiresIn ?? 0,
                refreshToken: responseData?.RefreshToken ?? '',
                refreshTokenExpireIn: responseData?.ExpiresIn ?? 0,
                token: responseData?.AccessToken ?? '',
                tokenType: 'Bearer',
            };
            const signIn = login(sessionData);
            return signIn ? ok(signIn) : err({ reason: '`access_token` is missing in server response' });
        } catch (error: unknown) {
            if (isApolloError(error)) {
                toast.error(error.networkError?.message ?? 'Unknown error occurred');
                return err({ reason: error.networkError?.message ?? 'Unknown error occurred' });
            } else {
                toast.error('Unknown error occurred');
                return err({ reason: 'Unknown error occurred' });
            }
        }
    };

    const signOut = async () => {
        try {
            const refreshToken = authContext?.authState?.refresh?.token ?? '';
            await logoutMutation({ variables: { refreshToken }, ...setHeaders(getAuth()) });
        } finally {
            logout();
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
    };
}
