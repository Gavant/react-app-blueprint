import React from 'react';
import { AuthProvider } from 'react-auth-kit';
import ReactDOM from 'react-dom/client';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';
import { createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';

import ApolloClientProvider from '~/core/stores/apollo';
import ThemeModeProvider from '~/core/stores/themeMode';
import { ToastProvider } from '~/core/stores/toastContext';
import { refresh } from '~/features/authentication/public/utils/apolloRefresh';
import MainRoutes from '~/main.routes';
export const router = createBrowserRouter(createRoutesFromElements(MainRoutes));

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ThemeModeProvider>
            <AuthProvider
                authName={import.meta.env.VITE_AUTH_COOKIE_NAME}
                authType="cookie"
                cookieDomain={import.meta.env.VITE_HOST_DOMAIN}
                cookieSecure={Boolean(import.meta.env.VITE_HOST_IS_SECURE)}
                refresh={refresh}
            >
                <ToastProvider>
                    <ApolloClientProvider>
                        <HelmetProvider>
                            <RouterProvider router={router} />
                        </HelmetProvider>
                    </ApolloClientProvider>
                </ToastProvider>
            </AuthProvider>
        </ThemeModeProvider>
    </React.StrictMode>
);
