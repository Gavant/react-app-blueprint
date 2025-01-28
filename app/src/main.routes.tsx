import { createBrowserRouter } from 'react-router-dom';

import App from '~/features/app/public/AppView';
import RequireAuth from '~/features/authentication/public/utils/RequireAuth';

// Route configuration with lazy loading
const router = createBrowserRouter([
    {
        children: [],
        element: (
            <RequireAuth fallbackPath="/login">
                <App />
            </RequireAuth>
        ), // We have to test this. Can't tell if its working in the blueprint
        lazy: () => import('~/features/app/public/AppView').then((module) => ({ Component: module.default })),
    },
    {
        lazy: () => import('~/features/authentication/public/LoginView').then((module) => ({ Component: module.default })),
        path: '/login',
    },
    {
        lazy: () => import('~/features/authentication/public/ForgotPasswordView').then((module) => ({ Component: module.default })),
        path: '/forgot-password',
    },
    {
        lazy: () => import('~/core/components/G-splash').then((module) => ({ Component: module.default })),
        path: '/splash',
    },
    {
        lazy: () => import('~/features/404/public/FourOhFourView').then((module) => ({ Component: module.default })),
        path: '*',
    },
]);

export default router;
