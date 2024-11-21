import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useWindowSize from '~/core/hooks/useWindowSize';
import LoginView from '~/features/authentication/public/LoginView';
import { render, screen, waitFor } from '~/vitest/utils';
// Mock dependencies
vi.mock('~/core/hooks/useWindowSize');

vi.mock('~/core/components/G-splash', () => ({
    default: () => <div data-testid="g-splash" />,
}));

describe('LoginView', () => {
    beforeEach(() => {
        vi.mocked(useWindowSize).mockReturnValue({
            isDesktop: true,
            isMobile: false,
            size: { height: 768, width: 1024 },
        });
    });

    it('renders login form elements', () => {
        render(<LoginView />);

        expect(screen.getByText(/Sign into/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i, { selector: 'input' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('renders forgot password and create account links', () => {
        render(<LoginView />);

        expect(screen.getByText('Forgot password?')).toHaveAttribute('href', '/forgot-password');
        expect(screen.getByText('Create Account')).toHaveAttribute('href', '/create-account');
    });

    it('toggles password visibility when show/hide button is clicked', async () => {
        const user = userEvent.setup();
        render(<LoginView />);

        const passwordInput = screen.getByLabelText(/Password/i, { selector: 'input' });
        expect(passwordInput).toHaveAttribute('type', 'password');

        const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });

        await act(async () => {
            await user.click(toggleButton);
        });

        await waitFor(() => {
            expect(passwordInput).toHaveAttribute('type', 'text');
        });

        await act(async () => {
            await user.click(toggleButton);
        });

        await waitFor(() => {
            expect(passwordInput).toHaveAttribute('type', 'password');
        });
    });

    it('displays GSplash when isDesktop is true', () => {
        render(<LoginView />);
        const gSplash = screen.getByTestId('g-splash');
        expect(gSplash).toBeInTheDocument();
    });

    it('does not display GSplash when isDesktop is false', () => {
        vi.mocked(useWindowSize).mockReturnValue({
            isDesktop: false,
            isMobile: true,
            size: { height: 500, width: 350 },
        });
        render(<LoginView />);
        const gSplash = screen.queryByTestId('g-splash');
        expect(gSplash).not.toBeInTheDocument();
    });

    it('toggles color mode when color mode toggle button is clicked', async () => {
        const user = userEvent.setup();
        render(<LoginView />);

        // Find color mode toggle button
        const toggleButton = screen.getByRole('button', { name: /toggle-color-mode/i });
        expect(toggleButton).toBeInTheDocument();

        // Default is light mode - should show dark mode icon
        expect(screen.getByTestId('Brightness4Icon')).toBeInTheDocument();

        // Click to toggle to dark mode
        await act(async () => {
            await user.click(toggleButton);
        });

        // Should show light mode icon in dark mode
        await waitFor(() => {
            expect(screen.getByTestId('Brightness7Icon')).toBeInTheDocument();
        });

        // Click again to toggle back to light mode
        await act(async () => {
            await user.click(toggleButton);
        });

        // Should show dark mode icon again
        await waitFor(() => {
            expect(screen.getByTestId('Brightness4Icon')).toBeInTheDocument();
        });
    });
});
