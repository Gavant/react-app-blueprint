import { useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import Result, { isOk } from 'true-myth/result';
import useAuth from '~/features/authentication/public/hooks/useAuth';

export interface LoginForm {
    password: string;
    username: string;
}

export default function useLoginForm() {
    const { authenticate } = useAuth();
    const navigate = useNavigate();
    const [submitErrors, setSubmitErrors] = useState<null | Result<boolean, { reason: string }>>(null);
    const [submitResult, setSubmitResult] = useState<null | Result<boolean, { reason: string }>>(null);

    const {
        formState: { dirtyFields, errors, isDirty, isSubmitted, isValid, isSubmitting, isSubmitSuccessful },
        handleSubmit,
        register,
    } = useForm<LoginForm>({
        defaultValues: { password: '', username: '' },
    });

    const errorMsg = useMemo(() => {
        if (isSubmitted && !isValid) {
            if (errors.password?.type && errors.username?.type) {
                return 'Username and password are required';
            }

            if (errors.password?.type) {
                return 'Password is required';
            }

            if (errors.username?.type) {
                return 'Username is required';
            }
        }

        if (isSubmitted && isValid && submitErrors) {
            return 'Invalid username or password';
        }
    }, [isValid, isSubmitted, errors.password, errors.username, submitErrors]);

    const hasError = !!errorMsg;

    const onValidSubmit: SubmitHandler<LoginForm> = async (data: LoginForm, event) => {
        const { password, username } = data;

        event?.preventDefault();
        setSubmitErrors(null);
        const result = await authenticate.signIn(username, password);
        setSubmitResult(result);
        if (isOk(result)) {
            navigate('/');
        } else {
            setSubmitErrors(result);
            // forces the SubmitButton failure/shake state
            // throw result;
        }
        return result;
    };

    const onSubmit = async () => {
        await handleSubmit(onValidSubmit);
        return submitResult;
    };

    return {
        dirtyFields,
        errorMsg,
        errors,
        hasError,
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
