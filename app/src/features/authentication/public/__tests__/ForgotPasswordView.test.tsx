import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useWindowSize from '~/core/hooks/useWindowSize';
import ForgotPasswordView from '~/features/authentication/public/ForgotPasswordView';
import { render, screen, waitFor } from '~/vitest/utils';

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

    it('renders forgot password form elements', () => {
        render(<ForgotPasswordView />);

        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
        expect(screen.getByText(/Enter your email address/i)).toBeInTheDocument();
    });

    it('renders back to login link', () => {
        render(<ForgotPasswordView />);
        expect(screen.getByText('Back to Login')).toHaveAttribute('href', '/login');
    });

    it('displays GSplash when isDesktop is true', () => {
        render(<ForgotPasswordView />);
        const gSplash = screen.getByTestId('g-splash');
        expect(gSplash).toBeInTheDocument();
    });

    it('does not display GSplash when isDesktop is false', () => {
        vi.mocked(useWindowSize).mockReturnValue({
            isDesktop: false,
            isMobile: true,
            size: { height: 500, width: 350 },
        });
        render(<ForgotPasswordView />);
        const gSplash = screen.queryByTestId('g-splash');
        expect(gSplash).not.toBeInTheDocument();
    });

    it('toggles color mode when color mode toggle button is clicked', async () => {
        const user = userEvent.setup();
        render(<ForgotPasswordView />);

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
    });
});
