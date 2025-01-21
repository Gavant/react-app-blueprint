// import App from '~/features/app/public/AppView';
// import RequireAuth from '~/features/authentication/public/utils/RequireAuth';

// Route configuration with lazy loading
const routes = [
    {
        children: [],
        file: './src/features/app/public/AppView',
        path: '/',
    },
    {
        file: './src/features/authentication/public/LoginView',
        path: '/login',
    },
    {
        file: './src/features/authentication/public/ForgotPasswordView',
        path: '/forgot-password',
    },
    {
        file: './src/core/components/G-splash',
        path: '/splash',
    },
    {
        file: './src/features/404/public/FourOhFourView',
        path: '*',
    },
];

export default routes;
