import { act } from 'react';
import { useContext } from 'react';
import { describe, expect, it } from 'vitest';

import { ToastContext, ToastProvider } from '../toastContext';

import { render, screen } from '~/vitest/utils';

describe('ToastContext', () => {
    const TestComponent = () => {
        const { toast, toastMsg } = useContext(ToastContext);
        return (
            <div>
                <button onClick={() => toast.success('Success message')}>Show Success</button>
                <button onClick={() => toast.error('Error message')}>Show Error</button>
                <button onClick={() => toast.info('Info message')}>Show Info</button>
                <button onClick={() => toast.warning('Warning message')}>Show Warning</button>
                {toastMsg && <div data-testid="toast-message">{toastMsg.msg}</div>}
            </div>
        );
    };

    it('provides toast context to children', () => {
        render(
            <ToastProvider>
                <TestComponent />
            </ToastProvider>
        );

        expect(screen.getByRole('button', { name: 'Show Success' })).toBeInTheDocument();
    });

    it('shows success toast message', async () => {
        render(
            <ToastProvider>
                <TestComponent />
            </ToastProvider>
        );

        await act(async () => {
            screen.getByRole('button', { name: 'Show Success' }).click();
        });

        expect(screen.getByTestId('toast-message')).toHaveTextContent('Success message');
    });

    it('shows error toast message', async () => {
        render(
            <ToastProvider>
                <TestComponent />
            </ToastProvider>
        );

        await act(async () => {
            screen.getByRole('button', { name: 'Show Error' }).click();
        });

        expect(screen.getByTestId('toast-message')).toHaveTextContent('Error message');
    });

    it('handles custom toast options', async () => {
        const TestCustomComponent = () => {
            const { toast, toastMsg } = useContext(ToastContext);
            return (
                <div>
                    <button
                        onClick={() =>
                            toast.info('Custom message', {
                                autohideDuration: 5000,
                                key: 'custom-key',
                                open: false,
                            })
                        }
                    >
                        Show Custom
                    </button>
                    {toastMsg && (
                        <div data-testid="toast-message">
                            {toastMsg.msg}
                            {toastMsg.key}
                            {toastMsg.autohideOverride}
                            {String(toastMsg.open)}
                        </div>
                    )}
                </div>
            );
        };

        render(
            <ToastProvider>
                <TestCustomComponent />
            </ToastProvider>
        );

        await act(async () => {
            screen.getByRole('button', { name: 'Show Custom' }).click();
        });

        const toastMessage = screen.getByTestId('toast-message');
        expect(toastMessage).toHaveTextContent('Custom message');
        expect(toastMessage).toHaveTextContent('custom-key');
        expect(toastMessage).toHaveTextContent('5000');
        expect(toastMessage).toHaveTextContent('false');
    });

    it('generates default key from message', async () => {
        const TestKeyComponent = () => {
            const { toast, toastMsg } = useContext(ToastContext);
            return (
                <div>
                    <button onClick={() => toast.warning('Test Message Here')}>Show Warning</button>
                    {toastMsg && <div data-testid="toast-key">{toastMsg.key}</div>}
                </div>
            );
        };

        render(
            <ToastProvider>
                <TestKeyComponent />
            </ToastProvider>
        );

        await act(async () => {
            screen.getByRole('button', { name: 'Show Warning' }).click();
        });

        expect(screen.getByTestId('toast-key')).toHaveTextContent('test-message-here');
    });
});
