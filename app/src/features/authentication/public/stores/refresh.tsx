import axios from 'axios';
import Cookies from 'js-cookie';
import { createContext, ReactElement, useRef } from 'react';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import useSignOut from 'react-auth-kit/hooks/useSignOut';

import { createSessionData } from '~/features/authentication/utils/session';

type RefreshCallback = () => void;

export const RefreshContext = createContext<{
    refreshToken: () => Promise<boolean>;
    subscribe: (callback: RefreshCallback) => void;
    unsubscribe: (callback: RefreshCallback) => void;
}>({
    refreshToken: async () => true,
    subscribe: () => {},
    unsubscribe: () => {},
});

type AxiosRefreshTokenMutation = {
    __typename?: 'Mutation';
    refreshToken: { __typename?: 'BaseAuthenticationResult'; AccessToken: string; ExpiresIn: number; TokenType: string };
};

const useAxiosRefresh = () => {
    const refreshMutation = async (): Promise<{ data: { data: AxiosRefreshTokenMutation | undefined } }> => {
        const refreshToken = Cookies.get(import.meta.env.VITE_REFRESH_COOKIE_NAME);
        try {
            if (refreshToken) {
                return await axios.post<{ data: AxiosRefreshTokenMutation }>(`${import.meta.env.VITE_API_BASE_URI}graphql`, {
                    headers: {
                        Accept: '*/*',
                        Authorization: '',
                    },
                    query: `
                    mutation RefreshToken($refreshToken: String!) {
                        refreshToken(refreshToken: $refreshToken) {
                            AccessToken
                            TokenType
                            ExpiresIn
                        }
                    }
                `,
                    variables: { refreshToken },
                });
            }
            return { data: { data: undefined } };
        } catch (error) {
            throw new Error('Failed to refresh token');
        }
    };

    return { refreshMutation };
};

const dumpSession = async (logout: () => void) => {
    Cookies.remove(import.meta.env.VITE_REFRESH_COOKIE_NAME);
    Cookies.remove(import.meta.env.VITE_AUTH_COOKIE_NAME);
    logout();
};

export const RefreshProvider = ({ children }: { children: ReactElement | ReactElement[] }) => {
    const { refreshMutation } = useAxiosRefresh();
    const refreshPromise = useRef<null | Promise<boolean>>(null);
    const login = useSignIn();
    const logout = useSignOut();
    const callbacks = useRef<Set<RefreshCallback>>(new Set());

    const refreshToken = async (): Promise<boolean> => {
        if (refreshPromise.current) {
            return refreshPromise.current;
        }

        const promise = (async () => {
            try {
                const { data: result } = await refreshMutation();
                if (result.data) {
                    const username = Cookies.get(import.meta.env.VITE_USER_COOKIE_NAME) ?? '';
                    const responseData = result?.data?.refreshToken ?? undefined;
                    const sessionData = createSessionData(responseData, username);

                    if (login(sessionData)) {
                        return true;
                    }
                }
                await dumpSession(logout);
                return false;
            } catch (error) {
                console.log('Refresh Error', error);
                await dumpSession(logout);
                return false;
            } finally {
                // Notify all subscribers
                callbacks.current.forEach((callback) => callback());
                refreshPromise.current = null;
            }
        })();

        refreshPromise.current = promise;
        return promise;
    };

    const subscribe = (callback: RefreshCallback) => {
        callbacks.current.add(callback);
    };

    const unsubscribe = (callback: RefreshCallback) => {
        callbacks.current.delete(callback);
    };

    return <RefreshContext.Provider value={{ refreshToken, subscribe, unsubscribe }}>{children}</RefreshContext.Provider>;
};
