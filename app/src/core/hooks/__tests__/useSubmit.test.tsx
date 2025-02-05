import { FieldValues, UseFormReturn } from 'react-hook-form';
import { Result } from 'true-myth';
import { describe, expect, it, vi } from 'vitest';

import useSubmit, { UnknownMouseEvent } from '../useSubmit';

import { renderHook } from '~/vitest/utils';

type DummyResult<T> = { error?: string; isOk: boolean; value?: T };

function ok<T>(value: T): DummyResult<T> {
    return { isOk: true, value };
}

describe('useSubmit', () => {
    it('should call onValidSubmit when form is valid', async () => {
        const mockPreventDefault = vi.fn();
        const event = { preventDefault: mockPreventDefault } as unknown as UnknownMouseEvent;

        const formData = { name: 'John' };
        const form = {
            formState: { isValid: true },
            getValues: vi.fn().mockReturnValue(formData),
            trigger: vi.fn().mockResolvedValue(true),
        } as unknown as UseFormReturn<FieldValues, any, undefined>;

        const onValidSubmit = vi.fn(async (data: FieldValues) => ok(data) as unknown as Result<FieldValues, string>);

        const { result } = renderHook(() => useSubmit({ form, onValidSubmit }));
        const submit = await result.current(event);

        expect(mockPreventDefault).toHaveBeenCalled();
        expect(form.trigger).toHaveBeenCalled();
        expect(form.getValues).toHaveBeenCalled();
        expect(onValidSubmit).toHaveBeenCalledWith(formData);
        expect(submit).toEqual(ok(formData));
    });

    it('should return default error when form is invalid and no onInvalidSubmit is provided', async () => {
        const mockPreventDefault = vi.fn();
        const event = { preventDefault: mockPreventDefault } as unknown as UnknownMouseEvent;

        const form = {
            formState: { isValid: false },
            getValues: vi.fn(),
            trigger: vi.fn().mockResolvedValue(true),
        } as unknown as UseFormReturn<FieldValues, any, undefined>;

        const onValidSubmit = vi.fn(); // will not be called
        const { result } = renderHook(() => useSubmit({ form, onValidSubmit }));
        const submit = await result.current(event);

        expect(mockPreventDefault).toHaveBeenCalled();
        expect(form.trigger).toHaveBeenCalled();
        expect(onValidSubmit).not.toHaveBeenCalled();
        expect(submit.isOk).toBe(false);
        if (!submit.isOk) {
            expect(submit.error).toBe('Form is invalid');
        }
    });

    it('should return custom error when form is invalid and onInvalidSubmit is provided', async () => {
        const mockPreventDefault = vi.fn();
        const event = { preventDefault: mockPreventDefault } as unknown as UnknownMouseEvent;

        const customErrorMessage = 'Custom invalid form error';
        const form = {
            formState: { isValid: false },
            getValues: vi.fn(),
            trigger: vi.fn().mockResolvedValue(true),
        } as unknown as UseFormReturn<FieldValues, any, undefined>;

        const onValidSubmit = vi.fn();
        const onInvalidSubmit = vi.fn(() => customErrorMessage);
        const { result } = renderHook(() => useSubmit({ form, onInvalidSubmit, onValidSubmit }));
        const submit = await result.current(event);

        expect(mockPreventDefault).toHaveBeenCalled();
        expect(form.trigger).toHaveBeenCalled();
        expect(onValidSubmit).not.toHaveBeenCalled();
        expect(onInvalidSubmit).toHaveBeenCalledWith(form);
        if (!submit.isOk) {
            expect(submit.error).toBe(customErrorMessage);
        } else {
            throw new Error('Expected submit to be an error result');
        }
    });
});
