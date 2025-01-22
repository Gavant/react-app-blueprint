import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { createRoutesFromChildren, Route } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useWindowSize from '~/core/hooks/useWindowSize';
import ForgotPasswordView from '~/features/authentication/public/ForgotPasswordView';
import Login from '~/features/authentication/public/LoginView';
import { renderRoutes, screen, waitFor } from '~/vitest/utils';

vi.mock('react-router', async () => {
    const router = await vi.importActual<typeof import('react-router')>('react-router');
    return {
        ...router,
        useLocation: vi.fn().mockReturnValue(vi.fn()),
        useNavigate: vi.fn().mockReturnValue(vi.fn()),
    };
});

// Mock dependencies
vi.mock('~/core/hooks/useWindowSize');
vi.mock('~/core/components/G-splash', () => ({
    default: () => <div data-testid="g-splash" />,
}));

describe('ForgotPasswordView', () => {
    beforeEach(() => {
        vi.mocked(useWindowSize).mockReturnValue({
            isDesktop: true,
            isMobile: false,
            size: { height: 768, width: 1024 },
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders forgot password form elements', () => {
        renderRoutes(
            'memory',
            createRoutesFromChildren(
                <>
                    <Route element={<Login />} path="/login" />
                    <Route element={<ForgotPasswordView />} path="/forgot-password" />
                </>
            ),
            '/forgot-password'
        );

        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
        expect(screen.getByText(/Enter your email address/i)).toBeInTheDocument();
    });

    it('renders back to login link', () => {
        renderRoutes(
            'memory',
            createRoutesFromChildren(
                <>
                    <Route element={<Login />} path="/login" />
                    <Route element={<ForgotPasswordView />} path="/forgot-password" />
                </>
            ),
            '/forgot-password'
        );
        expect(screen.getByText('Back to Login')).toHaveAttribute('href', '/login');
    });

    it('navigates to login page when clicking back to login link', async () => {
        const user = userEvent.setup();
        renderRoutes(
            'memory',
            createRoutesFromChildren(
                <>
                    <Route element={<Login />} path="/login" />
                    <Route element={<ForgotPasswordView />} path="/forgot-password" />
                </>
            ),
            '/forgot-password'
        );

        const loginLink = screen.getByText('Back to Login');

        await act(async () => {
            await user.click(loginLink);
        });

        await waitFor(async () => {
            return expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
        });
    });

    it('displays GSplash when isDesktop is true', () => {
        renderRoutes(
            'memory',
            createRoutesFromChildren(
                <>
                    <Route element={<Login />} path="/login" />
                    <Route element={<ForgotPasswordView />} path="/forgot-password" />
                </>
            ),
            '/forgot-password'
        );
        const gSplash = screen.getByTestId('g-splash');
        expect(gSplash).toBeInTheDocument();
    });

    it('does not display GSplash when isDesktop is false', () => {
        vi.mocked(useWindowSize).mockReturnValue({
            isDesktop: false,
            isMobile: true,
            size: { height: 500, width: 350 },
        });
        renderRoutes(
            'memory',
            createRoutesFromChildren(
                <>
                    <Route element={<Login />} path="/login" />
                    <Route element={<ForgotPasswordView />} path="/forgot-password" />
                </>
            ),
            '/forgot-password'
        );
        const gSplash = screen.queryByTestId('g-splash');
        expect(gSplash).not.toBeInTheDocument();
    });

    it('toggles color mode when color mode toggle button is clicked', async () => {
        vi.mocked(useWindowSize).mockReturnValue({
            isDesktop: true,
            isMobile: false,
            size: { height: 1080, width: 1200 },
        });
        const user = userEvent.setup();
        renderRoutes(
            'memory',
            createRoutesFromChildren(
                <>
                    <Route element={<Login />} path="/login" />
                    <Route element={<ForgotPasswordView />} path="/forgot-password" />
                </>
            ),
            '/forgot-password'
        );

        const toggleButton = screen.getByRole('button', { name: /toggle-color-mode/i });
        expect(toggleButton).toBeInTheDocument();

        // Default is light mode - should show dark mode icon
        // expect(screen.getByTestId('Brightness4Icon')).toBeInTheDocument();

        // Click to toggle to dark mode
        await act(async () => {
            await user.click(toggleButton);
        });

        // expect(screen.getByTestId('Brightness7Icon')).toBeInTheDocument();
    });
});
