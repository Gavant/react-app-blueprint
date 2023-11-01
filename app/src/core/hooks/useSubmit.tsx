import { useCallback } from 'react';
import { MouseEvent } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import Result, { err } from 'true-myth/result';

export type UnknownMouseEvent = MouseEvent<unknown, Event>;

export type ReactHookForm<T extends FieldValues> = ReturnType<typeof useForm<T>>;

function useSubmit<T extends FieldValues>({
    form,
    onInvalidSubmit,
    onValidSubmit,
}: {
    form: ReturnType<typeof useForm<T>>;
    onInvalidSubmit?: (form: ReactHookForm<T>) => string;
    onValidSubmit: (data: T) => Promise<Result<T, string>>;
}): (event: UnknownMouseEvent) => Promise<Result<T, string>> {
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
