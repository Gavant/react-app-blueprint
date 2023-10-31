import { BaseSyntheticEvent, useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import Result, { err, isOk } from 'true-myth/result';
import useToast from '~/core/hooks/useToast';
import useAuth from '~/features/authentication/public/hooks/useAuth';

export interface LoginForm {
    password: string;
    username: string;
}

export default function useLoginForm() {
    const { authenticate } = useAuth();
    const navigate = useNavigate();
    const [submitErrors, setSubmitErrors] = useState<null | Result<boolean, { reason: string }>>(null);
    const { toast } = useToast();

    const {
        formState: { dirtyFields, errors, isDirty, isSubmitted, isValid, isSubmitting, isSubmitSuccessful },
        getValues,
        register,
        trigger,
    } = useForm<LoginForm>({
        defaultValues: { password: '', username: '' },
    });

    const onValidSubmit = async (data: LoginForm, event: BaseSyntheticEvent<object, any, any>) => {
        const { password, username } = data;

        event?.preventDefault();
        setSubmitErrors(null);
        const result = await authenticate.signIn(username, password);
        if (isOk(result)) {
            navigate('/');
        } else {
            setSubmitErrors(result);
        }
        return result;
    };

    const onInvalidSubmit = useCallback(
        (event: BaseSyntheticEvent<object, any, any>) => {
            event?.preventDefault();
            let error = '';
            if (errors.password?.type && errors.username?.type) {
                error = 'Username and password are required';
            } else if (errors.password?.type) {
                error = 'Password is required';
            } else if (errors.username?.type) {
                error = 'Username is required';
            }

            if (isSubmitted && isValid && submitErrors) {
                error = 'Invalid username or password';
            }
            console.log('error', error);
            return error;
        },
        [errors, isSubmitted, isValid, submitErrors]
    );

    const onSubmit = useCallback(
        async (event: BaseSyntheticEvent<object, any, any>) => {
            trigger();

            if (!isValid) {
                const invalidResult = onInvalidSubmit(event);

                toast.error(invalidResult);
                const errorResult = err({ reason: invalidResult });
                return errorResult;
            }

            const result = await onValidSubmit(getValues(), event);
            return result;
        },
        [trigger, toast, onValidSubmit, onInvalidSubmit, getValues]
    );

    return {
        dirtyFields,
        errors,
        isDirty,
        isSubmitted,
        isSubmitSuccessful,
        isValid,
        onSubmit,
        register,
        submitErrors,
        isSubmitting,
    };
}
