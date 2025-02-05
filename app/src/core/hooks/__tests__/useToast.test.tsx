import { renderHook } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import useToast from '../useToast';

import { Toast, ToastContext } from '~/core/stores/toastContext';

describe('useToast hook', () => {
    it('should return the context value when used within a ToastContext provider', () => {
        const dummyToast = { message: 'test toast', setToast: () => {}, show: () => {}, toast: '' as unknown as Toast, toastMsg: null };
        const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
            <ToastContext.Provider value={dummyToast}>{children}</ToastContext.Provider>
        );

        const { result } = renderHook(() => useToast(), { wrapper });
        expect(result.current).toBe(dummyToast);
    });

    it('should throw an error when used outside a ToastContext provider', () => {
        expect(() => renderHook(() => useToast())).toThrowError(new Error('useToast must be used within a AlertProvider'));
    });
});
