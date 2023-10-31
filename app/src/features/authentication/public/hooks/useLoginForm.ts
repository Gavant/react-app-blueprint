import { BaseSyntheticEvent, useCallback, useMemo, useState, useTransition } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import Result, { err, isOk } from 'true-myth/result';
import useAuth from '~/features/authentication/public/hooks/useAuth';

export interface LoginForm {
    password: string;
    username: string;
}

export default function useLoginForm() {
    const { authenticate } = useAuth();
    const navigate = useNavigate();
    const [submitErrors, setSubmitErrors] = useState<null | Result<boolean, { reason: string }>>(null);

    const {
        formState: { dirtyFields, errors, isDirty, isSubmitted, isValid, isSubmitting, isSubmitSuccessful },
        getValues,
        register,
        trigger,
    } = useForm<LoginForm>({
        defaultValues: { password: '', username: '' },
    });

    const onValidSubmit: SubmitHandler<LoginForm> = async (data: LoginForm, event) => {
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

    const onInvalidSubmit: SubmitErrorHandler<LoginForm> = async (errors: Object, event) => {
        event?.preventDefault();
        let error = '';
        if (isSubmitted && !isValid) {
            if (errors.password?.type && errors.username?.type) {
                error = 'Username and password are required';
            }

            if (errors.password?.type) {
                error = 'Password is required';
            }

            if (errors.username?.type) {
                error = 'Username is required';
            }
        }

        if (isSubmitted && isValid && submitErrors) {
            error = 'Invalid username or password';
        }
        const errorResult = err({ reason: error });
        return errorResult;
    };

    const onSubmit = async (event: BaseSyntheticEvent<object, any, any>) => {
        trigger();
        if (!isValid) return onInvalidSubmit(errors, event);
        const result = await onValidSubmit(getValues(), event);
        return result;
    };

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
