import { ReactNode } from 'react';
import AuthProvider from 'react-auth-kit';
// import createStore from 'react-auth-kit/createStore';
import { HelmetProvider } from 'react-helmet-async';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

// import './src/index.css';
import ApolloClientProvider from './src/core/stores/apollo';
import ThemeModeProvider from './src/core/stores/themeMode';
import { ToastProvider } from './src/core/stores/toastContext';
import { WindowSizeProvider } from './src/core/stores/windowSizeContext';

const cookieName = 'test_cooke';
const secure = true;

const cookieDomain = 'localhost';

// const store = createStore({ authName: cookieName, authType: 'cookie', cookieDomain: cookieDomain, cookieSecure: secure });

export function Layout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta content="width=device-width, initial-scale=1.0" name="viewport" />
                <title>{`{{ APP_NAME }}`}</title>
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function Root() {
    return (
        <>
            {/*<ThemeModeProvider>*/}
            {/*<AuthProvider store={store}>*/}
            <ToastProvider>
                {/*<ApolloClientProvider>*/}
                <HelmetProvider>
                    {/*<WindowSizeProvider>*/}
                    <Outlet />
                    {/*</WindowSizeProvider>*/}
                </HelmetProvider>
                {/*</ApolloClientProvider>*/}
            </ToastProvider>
            {/*</AuthProvider>*/}
            {/*</ThemeModeProvider>*/}
        </>
    );
}
