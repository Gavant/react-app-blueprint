import { InMemoryCache } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { fireEvent, Queries, queries, render, renderHook, RenderHookOptions, RenderOptions } from '@testing-library/react';
import React, { act, ReactElement } from 'react';
import AuthProvider from 'react-auth-kit';
import createStore from 'react-auth-kit/createStore';
import { createBrowserRouter, createMemoryRouter, RouteObject, RouterProvider } from 'react-router-dom';

import ThemeModeProvider from '~/core/stores/themeMode';
import { ToastProvider } from '~/core/stores/toastContext';

const ApolloCache = new InMemoryCache({
    addTypename: true,
    typePolicies: {
        Query: {
            fields: {
                articles: {
                    merge(existing, incoming, { args }) {
                        const merged = existing && Array.isArray(existing.data) ? existing.data.slice(0) : [];
                        for (let i = 0; i < incoming.data.length; ++i) {
                            merged[(args?.pagination.start ?? 0) + i] = incoming.data[i];
                        }
                        return {
                            data: {
                                articles: {
                                    data: merged,
                                },
                            },
                            meta: {
                                pagination: {
                                    total: incoming.meta.total ?? 0,
                                },
                            },
                        };
                    },

                    read(existing, { args }) {
                        return {
                            data:
                                (existing?.data &&
                                    Array.isArray(existing?.data) &&
                                    existing.data.slice(args?.pagination.start, args?.pagination.start + args?.pagination.limit)) ??
                                [],

                            meta: {
                                totalCount: existing?.meta.totalCount ?? 0,
                            },
                        };
                    },
                },
                posts: {
                    merge: true,
                },
            },
        },
    },
});

const cookieName = `${import.meta.env.VITE_AUTH_COOKIE_NAME}-test`;
const secure = Boolean(import.meta.env.VITE_HOST_IS_SECURE);

let cookieDomain;
if (import.meta.env.DEV) {
    cookieDomain = 'localhost';
} else {
    cookieDomain = import.meta.env.VITE_AUTH_HOST_DOMAIN;
}

const store = createStore({ authName: cookieName, authType: 'cookie', cookieDomain: cookieDomain, cookieSecure: secure });

const AllTheProviders = ({
    children,
    mocks = [],
}: {
    children: React.ReactNode;
    mocks?: readonly MockedResponse<Record<string, any>, Record<string, any>>[];
}) => {
    return (
        <ThemeModeProvider>
            <AuthProvider store={store}>
                <ToastProvider>
                    <MockedProvider addTypename={true} cache={ApolloCache} mocks={mocks}>
                        {children}
                    </MockedProvider>
                </ToastProvider>
            </AuthProvider>
        </ThemeModeProvider>
    );
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'> & {
        mocks?: readonly MockedResponse<Record<string, any>, Record<string, any>>[] | undefined;
        router?: ReturnType<typeof createBrowserRouter | typeof createMemoryRouter>;
    }
) => render(ui, { wrapper: (props) => <AllTheProviders {...props} mocks={options?.mocks} />, ...options });

const renderWithProvider = (ui: ReactElement, provider: ({ children }: { children: React.ReactNode }) => JSX.Element) =>
    render(<AllTheProviders>{ui}</AllTheProviders>, {
        wrapper: provider,
    });

const renderHookWithWrapper = <
    Result,
    Props,
    Q extends Queries = typeof queries,
    Container extends DocumentFragment | Element = HTMLElement,
    BaseElement extends DocumentFragment | Element = Container,
>(
    hook: (initialProps: Props) => Result,
    options?: RenderHookOptions<Props, Q, Container, BaseElement> & {
        mocks?: readonly MockedResponse<Record<string, any>, Record<string, any>>[] | undefined;
    }
) => {
    const { wrapper: Wrapper, ...rest } = options ?? {};

    return renderHook(hook, {
        wrapper: (props) => <AllTheProviders mocks={rest?.mocks}>{Wrapper ? <Wrapper {...props} /> : props.children}</AllTheProviders>,
        ...rest,
    });
};

/**
 * Render routes with the specified router type. If the router type is 'memory', the initial path can be specified.
 *
 *
 * @template RT
 * @param routerType
 * @param routesOrRouter
 * @param [initialPath]
 * @returns {*}
 */
const renderRoutes = <RT extends 'browser' | 'memory'>(
    routerType: RT,
    routesOrRouter: RouteObject[],
    initialPath?: RT extends 'memory' ? string : undefined
) => {
    const appRouter =
        routerType === 'browser'
            ? createBrowserRouter(routesOrRouter)
            : createMemoryRouter(routesOrRouter, {
                  initialEntries: [initialPath ?? routesOrRouter[0].path ?? '/'],
              });
    const { container } = customRender(<RouterProvider router={appRouter} />);
    return { container, router: appRouter };
};

const log = (value: string) => process.stdout.write(`${value} \n`);

const reactHookFormSubmit = (element: HTMLElement) => {
    // eslint-disable-next-line testing-library/no-unnecessary-act
    return act(async () => fireEvent.click(element));
};

export * from '@testing-library/react';
export {
    AllTheProviders,
    log,
    reactHookFormSubmit,
    customRender as render,
    renderHookWithWrapper as renderHook,
    renderRoutes,
    renderWithProvider,
};
