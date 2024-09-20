import {
    ApolloClient,
    ApolloProvider,
    createHttpLink,
    from,
    InMemoryCache,
    NormalizedCacheObject,
    Observable,
    ServerError,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import Cookies from 'js-cookie';
import { ReactNode, useContext } from 'react';

import { RefreshContext } from '~/features/authentication/public/stores/refresh';

const getAuthCookie = () => Cookies.get(import.meta.env.VITE_AUTH_COOKIE_NAME);

const httpLink = createHttpLink({
    uri: `${import.meta.env.VITE_API_BASE_URI}graphql`,
});

const createErrorLink = ({ refreshToken }: { refreshToken: () => Promise<boolean> }) =>
    onError(({ forward, networkError, operation }) => {
        if (networkError && (networkError as ServerError).statusCode === 401) {
            return new Observable((observer) => {
                refreshToken()
                    .then((success) => {
                        if (success) {
                            // Retry the request since the token has been refreshed
                            forward(operation).subscribe(observer);
                        } else {
                            observer.error(new Error("Couldn't automatically log in"));
                        }
                    })
                    .catch(observer.error.bind(observer));
            });
        }
        // If it's not a 401 error, or refreshToken fails, proceed with the default error handling
        return forward(operation);
    });

const nonAuthUris = [import.meta.env.VITE_CMS_BASE_URI];

const authLink = setContext((_, { headers, uri }) => {
    const token = getAuthCookie();
    const resultHeaders = {
        ...headers,
    };

    if (!nonAuthUris.includes(uri)) {
        resultHeaders.authorization = token ? `Bearer ${token}` : '';
    }

    return {
        headers: resultHeaders,
    };
});

const cache = new InMemoryCache();

export let client: ApolloClient<NormalizedCacheObject>;

export default function ApolloClientProvider({ children }: { children: ReactNode }) {
    const refresh = useContext(RefreshContext);

    client = new ApolloClient({
        cache,
        defaultOptions: {
            mutate: {
                errorPolicy: 'all',
            },
            query: {
                errorPolicy: 'all',
            },
            watchQuery: {
                errorPolicy: 'all',
                fetchPolicy: 'cache-and-network',
                nextFetchPolicy: 'cache-first',
            },
        },
        link: from([authLink, createErrorLink(refresh), httpLink]),
    });

    return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
