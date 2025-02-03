import { useCallback } from 'react';
import { MouseEvent } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import Result, { err } from 'true-myth/result';

export type ReactHookForm<T extends FieldValues> = ReturnType<typeof useForm<T>>;

export type UnknownMouseEvent = MouseEvent<unknown, Event>;

export interface UseSubmitProps<T extends FieldValues> {
    form: ReactHookForm<T>;
    onInvalidSubmit?: (form: ReactHookForm<T>) => string;
    onValidSubmit: (data: T) => Promise<Result<T, string>>;
}

export type UseSubmitReturn<T extends FieldValues> = (event: UnknownMouseEvent) => Promise<Result<T, string>>;

function useSubmit<T extends FieldValues>({ form, onInvalidSubmit, onValidSubmit }: UseSubmitProps<T>): UseSubmitReturn<T> {
    const onSubmit = useCallback(
        async (event: UnknownMouseEvent) => {
            event.preventDefault();
            const {
                formState: { isValid },
                getValues,
            } = form;

            await form.trigger();

            if (!isValid) {
                return err<T, string>(onInvalidSubmit?.(form) ?? 'Form is invalid');
            }

            const result = await onValidSubmit(getValues());
            return result;
        },
        [form, onInvalidSubmit, onValidSubmit]
    );
    return onSubmit;
}

export default useSubmit;
