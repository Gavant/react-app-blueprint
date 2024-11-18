import React from 'react';
import AuthProvider from 'react-auth-kit';
import createStore from 'react-auth-kit/createStore';
import ReactDOM from 'react-dom/client';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import ApolloClientProvider from '~/core/stores/apollo';
import ThemeModeProvider from '~/core/stores/themeMode';
import { ToastProvider } from '~/core/stores/toastContext';
import MainRoutes from '~/main.routes';

const cookieName = import.meta.env.VITE_AUTH_COOKIE_NAME;
const secure = Boolean(import.meta.env.VITE_HOST_IS_SECURE);

let cookieDomain;
if (import.meta.env.DEV) {
    cookieDomain = 'localhost';
} else {
    cookieDomain = import.meta.env.VITE_AUTH_HOST_DOMAIN;
}

const store = createStore({ authName: cookieName, authType: 'cookie', cookieDomain: cookieDomain, cookieSecure: secure });

export const router = createBrowserRouter(createRoutesFromElements(MainRoutes));

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ThemeModeProvider>
            <AuthProvider store={store}>
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
