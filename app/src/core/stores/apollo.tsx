import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import React from 'react';

const getAuthCookie = () => document.cookie.match(`(^|;)\\s*${import.meta.env.VITE_AUTH_COOKIE_NAME}\\s*=\\s*([^;]+)`)?.pop() || '';

const kickToLogin = () => (window.location.href = `${window.location.protocol + '//' + window.location.host}/login`);

const httpLink = createHttpLink({
    uri: `${import.meta.env.VITE_API_BASE_URI}/graphql`,
});

const onErrorLink = onError((errors) => {
    if (errors?.graphQLErrors) {
        for (const err of errors.graphQLErrors) {
            if (err?.path?.[0] !== 'login') {
                if (err.extensions?.status_code) {
                    switch (err.extensions?.status_code) {
                        case 401:
                            kickToLogin();
                    }
                } else {
                    switch (err.extensions?.code) {
                        case 'UNAUTHENTICATED':
                            kickToLogin();
                            break;
                        default:
                            console.error(err.message);
                            break;
                    }
                }
            }
        }
    } else if (errors?.networkError) {
        if (window.location.pathname !== '/login') {
            kickToLogin();
        }
    }
});

const authLink = setContext((_, { headers }) => {
    const token = getAuthCookie();
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(onErrorLink).concat(httpLink),
});

export default function ApolloClientProvider({ children }: { children: React.ReactNode }) {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
