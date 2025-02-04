import { describe, expect, it, Mock, vi } from 'vitest';

import ToastBar from '../ToastBar';

import useToast from '~/core/hooks/useToast';
import { ToastProvider } from '~/core/stores/toastContext';
import { render, screen } from '~/vitest/utils';

vi.mock('~/core/hooks/useToast');

describe('ToastBar', () => {
    const renderToastProvider = (ui: React.ReactElement) => {
        render(<ToastProvider>{ui}</ToastProvider>);
    };
    it('renders the ToastBar component with a message', () => {
        const mockSetToast = vi.fn();
        const mockToastMsg = { key: '1', msg: 'Test message', open: true, severity: 'info' };

        (useToast as Mock).mockReturnValue({
            setToast: mockSetToast,
            toastMsg: mockToastMsg,
        });

        renderToastProvider(<ToastBar />);

        expect(screen.getByText('Test message')).toBeInTheDocument();
    });
});
