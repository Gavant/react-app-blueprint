import { act } from 'react';
import Result, { isOk, ok } from 'true-myth/result';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReactHookForm } from '~/core/hooks/useSubmit';
import useForgotPasswordForm from '~/features/authentication/public/hooks/useForgotPasswordForm';
import { ForgotPasswordSchema } from '~/features/schemas/ForgoPassword';
import { renderHook } from '~/vitest/utils';

// Capture submit callbacks passed to useSubmit
let capturedSubmitOptions: null | {
    onInvalidSubmit: (form: ReactHookForm<any>) => string;
    onValidSubmit: (data: any) => Promise<any>;
} = null;

// Mock useSubmit to capture the callbacks and return onValidSubmit as onSubmit
vi.mock('~/core/hooks/useSubmit', () => ({
    __esModule: true,
    default: (options: { form: any; onInvalidSubmit: any; onValidSubmit: any }) => {
        capturedSubmitOptions = options;
        return options.onValidSubmit;
    },
}));

// Mock useNavigate from react-router
const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
    useNavigate: () => mockNavigate,
}));

// Mock useToast
const mockToast = {
    error: vi.fn(),
};
vi.mock('~/core/hooks/useToast', () => ({
    default: () => ({ toast: mockToast }),
}));

// Mock useVerifyEmail
const mockVerifyEmail = vi.fn();
vi.mock('~/features/authentication/public/hooks/useVerifyEmail', () => ({
    __esModule: true,
    default: () => ({
        verifyEmail: mockVerifyEmail,
    }),
}));

describe('useForgotPasswordForm', () => {
    beforeEach(() => {
        mockNavigate.mockReset();
        mockToast.error.mockReset();
        capturedSubmitOptions = null;
        mockVerifyEmail.mockReset();
    });

    it('should return expected properties', () => {
        const { result } = renderHook(() => useForgotPasswordForm());

        expect(result.current).toHaveProperty('control');
        expect(result.current).toHaveProperty('errors');
        expect(result.current).toHaveProperty('onSubmit');
        expect(result.current).toHaveProperty('register');
        expect(result.current).toHaveProperty('schema', ForgotPasswordSchema);
    });

    it('should navigate with success true when verifyEmail returns Ok', async () => {
        // Arrange: simulate verifyEmail returning an Ok result
        mockVerifyEmail.mockResolvedValue(ok(true));
        renderHook(() => useForgotPasswordForm());

        const formData = { username: 'testuser' };
        const submissionResult = await act(async () => {
            return await capturedSubmitOptions!.onValidSubmit(formData);
        });

        expect(mockVerifyEmail).toHaveBeenCalledWith('testuser');
        expect(mockNavigate).toHaveBeenCalledWith('/forgot-password?success=true');
        expect(isOk(submissionResult)).toBe(true);
    });

    it('should navigate with success false when verifyEmail returns Err', async () => {
        // Arrange: simulate verifyEmail returning an Err result
        const errorResult = { _tag: 'Err', error: new Error('Invalid email') };
        mockVerifyEmail.mockResolvedValue(errorResult);
        renderHook(() => useForgotPasswordForm());

        const formData = { username: 'testuser' };

        const submissionResult = await act(async () => {
            return await capturedSubmitOptions!.onValidSubmit(formData);
        });
        expect(mockVerifyEmail).toHaveBeenCalledWith('testuser');
        expect(mockNavigate).toHaveBeenCalledWith('/forgot-password?success=false');
        expect(isOk(submissionResult)).toBe(true);
    });

    it('should call toast.error on invalid submit and return error message', () => {
        // Arrange: create dummy form with an error on the username field
        const dummyForm = {
            formState: {
                errors: {
                    username: { message: 'Username is required', type: 'required' },
                },
            },
        } as unknown as ReactHookForm<any>;

        renderHook(() => useForgotPasswordForm());
        const errorMessage = capturedSubmitOptions?.onInvalidSubmit(dummyForm);

        expect(mockToast.error).toHaveBeenCalledWith('Username is required');
        expect(errorMessage).toBe('Username is required');
    });
});
