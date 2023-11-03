import { AlertColor } from '@mui/material';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ToastBar from '~/core/components/ToastBar';
import { ToastContext } from '~/core/stores/toastContext';

const { error, info, success, warning } = vi.hoisted(() => {
    return {
        error: vi.fn(),
        info: vi.fn(),
        success: vi.fn(),
        warning: vi.fn(),
    };
});

describe('ToastBar', () => {
    it('renders the toast message', () => {
        const toastMsg = {
            key: '1',
            msg: 'Test Message',
            open: true,
            severity: 'info' as AlertColor,
        };

        const setToast = vi.fn();

        render(
            <ToastContext.Provider
                value={{
                    setToast,
                    toast: {
                        error,
                        info,
                        success,
                        warning,
                    },
                    toastMsg,
                }}
            >
                <ToastBar />
            </ToastContext.Provider>
        );

        const toastMessage = screen.getByText('Test Message');
        expect(toastMessage).toBeInTheDocument();
    });
});
