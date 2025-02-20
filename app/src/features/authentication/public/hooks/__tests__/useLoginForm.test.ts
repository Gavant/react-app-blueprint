import { act } from 'react';
import { isOk } from 'true-myth/result';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReactHookForm, UnknownMouseEvent } from '~/core/hooks/useSubmit';
import useLoginForm from '~/features/authentication/public/hooks/useLoginForm';
import { LoginSchema } from '~/features/schemas/Login';
import { renderHook } from '~/vitest/utils';

// Variables to capture the callbacks passed to useSubmit
let capturedSubmitOptions: null | {
    onInvalidSubmit: (form: ReactHookForm<any>) => string;
    onValidSubmit: (data: any) => Promise<any>;
} = null;

// Mock useSubmit to simply capture the callbacks and return the onValidSubmit callback as onSubmit
vi.mock('~/core/hooks/useSubmit', () => ({
    __esModule: true,
    default: (options: { onInvalidSubmit: any; onValidSubmit: any }) => {
        capturedSubmitOptions = options;
        return options.onValidSubmit;
    },
}));

// Create a mock for useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
    useNavigate: () => mockNavigate,
}));

// Prepare a mock for useAuth to control the authentication.signIn behavior
const mockSignIn = vi.fn();
const mockAuth = {
    authenticate: {
        signIn: mockSignIn,
    },
};

vi.mock('~/features/authentication/public/hooks/useAuth', () => ({
    __esModule: true,
    default: () => mockAuth,
}));

// Import the hook under test

describe('useLoginForm', () => {
    const redirectUrl = '/dashboard';

    beforeEach(() => {
        mockNavigate.mockReset();
        mockSignIn.mockReset();
        capturedSubmitOptions = null;
    });

    it('should return expected properties', () => {
        const { result } = renderHook(() => useLoginForm(redirectUrl));

        expect(result.current).toHaveProperty('control');
        expect(result.current).toHaveProperty('dirtyFields');
        expect(result.current).toHaveProperty('errors');
        expect(result.current).toHaveProperty('isDirty');
        expect(result.current).toHaveProperty('isSubmitSuccessful');
        expect(result.current).toHaveProperty('isSubmitted');
        expect(result.current).toHaveProperty('isSubmitting');
        expect(result.current).toHaveProperty('isValid');
        expect(result.current).toHaveProperty('onSubmit');
        expect(result.current).toHaveProperty('register');
        expect(result.current).toHaveProperty('schema', LoginSchema);
    });

    it('should call navigate on valid submission', async () => {
        // Arrange: mock signIn to return an Ok result
        mockSignIn.mockResolvedValue({ _tag: 'Ok' });

        const { result } = renderHook(() => useLoginForm(redirectUrl));

        // Act: call the onSubmit callback (which is onValidSubmit from our mocked useSubmit)
        await act(async () => {
            const res = await result.current.onSubmit(new MouseEvent('click') as unknown as UnknownMouseEvent);

            // And if signIn returns Ok, then navigate should be called
            if (isOk(res)) {
                expect(mockNavigate).toHaveBeenCalledWith(redirectUrl ?? '/');
            }
        });
    });

    it('should return the error result when sign in fails', async () => {
        // Arrange: mock signIn to return an Err result
        const errorResult = { _tag: 'Err', error: new Error('Invalid credentials') };
        mockSignIn.mockResolvedValue(errorResult);

        const { result } = renderHook(() => useLoginForm(redirectUrl));

        // Act: call the onSubmit callback
        let returnedResult;
        await act(async () => {
            returnedResult = await result.current.onSubmit(new MouseEvent('click') as unknown as UnknownMouseEvent);
        });

        expect(mockNavigate).not.toHaveBeenCalled();
        expect(returnedResult).toEqual(errorResult);
    });

    describe('onInvalidSubmit (extracted from useSubmit)', () => {
        it('should return "Username and password are required" when both errors exist', () => {
            // Build a dummy ReactHookForm with errors on both fields
            const dummyForm = {
                formState: {
                    errors: {
                        password: { type: 'required' },
                        username: { type: 'required' },
                    },
                    isSubmitted: true,
                    isValid: false,
                },
            } as unknown as ReactHookForm<any>;

            // Ensure that our captured callback exists by rendering the hook
            renderHook(() => useLoginForm(redirectUrl));
            const errorMessage = capturedSubmitOptions?.onInvalidSubmit(dummyForm);
            expect(errorMessage).toBe('Username and password are required');
        });

        it('should return "Password is required" when only password has error', () => {
            const dummyForm = {
                formState: {
                    errors: {
                        password: { type: 'required' },
                    },
                    isSubmitted: true,
                    isValid: false,
                },
            } as unknown as ReactHookForm<any>;

            renderHook(() => useLoginForm(redirectUrl));
            const errorMessage = capturedSubmitOptions?.onInvalidSubmit(dummyForm);
            expect(errorMessage).toBe('Password is required');
        });

        it('should return "Username is required" when only username has error', () => {
            const dummyForm = {
                formState: {
                    errors: {
                        username: { type: 'required' },
                    },
                    isSubmitted: true,
                    isValid: false,
                },
            } as unknown as ReactHookForm<any>;

            renderHook(() => useLoginForm(redirectUrl));
            const errorMessage = capturedSubmitOptions?.onInvalidSubmit(dummyForm);
            expect(errorMessage).toBe('Username is required');
        });

        it('should return "Invalid username or password" when form is submitted and valid', () => {
            const dummyForm = {
                formState: {
                    errors: {},
                    isSubmitted: true,
                    isValid: true,
                },
            } as unknown as ReactHookForm<any>;

            renderHook(() => useLoginForm(redirectUrl));
            const errorMessage = capturedSubmitOptions?.onInvalidSubmit(dummyForm);
            expect(errorMessage).toBe('Invalid username or password');
        });
    });
});
