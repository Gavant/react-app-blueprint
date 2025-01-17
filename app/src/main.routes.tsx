import { createBrowserRouter } from 'react-router-dom';
import { Authenticate } from '~/core/utils/routing';
import App from '~/features/app/public/AppView';

// Route configuration with lazy loading
const router = createBrowserRouter([
  {
    path: '/',
    element: Authenticate(<App />),
    lazy: () => import('~/features/app/public/AppView').then(module => ({ Component: module.default })),
    children: [
      // Add authenticated child routes here, with lazy loading
    ],
  },
  {
    path: '/login',
    lazy: () => import('~/features/authentication/public/LoginView').then(module => ({ Component: module.default })),
  },
  {
    path: '/forgot-password',
    lazy: () => import('~/features/authentication/public/ForgotPasswordView').then(module => ({ Component: module.default })),
  },
  {
    path: '/splash',
    lazy: () => import('~/core/components/G-splash').then(module => ({ Component: module.default })),
  },
  {
    path: '*',
    lazy: () => import('~/features/404/public/FourOhFourView').then(module => ({ Component: module.default })),
  },
]);

export default router;
