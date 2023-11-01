import { useCallback } from 'react';
import { MouseEvent } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import Result, { err } from 'true-myth/result';

export type UnknownMouseEvent = MouseEvent<unknown, Event>;

function useSubmit<T extends FieldValues>({
    form,
    onInvalidSubmit,
    onValidSubmit,
}: {
    form: ReturnType<typeof useForm<T>>;
    onInvalidSubmit?: (event: UnknownMouseEvent) => string;
    onValidSubmit: (data: T, event: UnknownMouseEvent) => Promise<Result<T, string>>;
}): (event: UnknownMouseEvent) => Promise<Result<T, string>> {
    const onSubmit = useCallback(
        async (event: UnknownMouseEvent) => {
            const {
                formState: { isValid },
                getValues,
            } = form;

            await form.trigger();

            if (!isValid) {
                return err<T, string>(onInvalidSubmit?.(event) ?? 'Form is invalid');
            }

            const result = await onValidSubmit(getValues(), event);
            return result;
        },
        [form, onInvalidSubmit, onValidSubmit]
    );
    return onSubmit;
}

export default useSubmit;
