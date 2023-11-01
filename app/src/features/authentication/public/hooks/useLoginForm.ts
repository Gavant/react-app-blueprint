import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import Result, { isOk } from 'true-myth/result';

import useSubmit, { ReactHookForm } from '~/core/hooks/useSubmit';
import useAuth from '~/features/authentication/public/hooks/useAuth';

export interface LoginForm {
    password: string;
    username: string;
}

export default function useLoginForm() {
    const { authenticate } = useAuth();
    const navigate = useNavigate();
    // const [submitErrors, setSubmitErrors] = useState<Result<LoginForm, string> | null>(null);

    const form = useForm<LoginForm>({
        defaultValues: { password: '', username: '' },
    });

    const {
        formState: { dirtyFields, errors, isDirty, isSubmitSuccessful, isSubmitted, isSubmitting, isValid },
    } = form;

    const onValidSubmit = useCallback(
        async (data: LoginForm): Promise<Result<LoginForm, string>> => {
            const { password, username } = data;

            // setSubmitErrors(null);
            const result = await authenticate.signIn(username, password);
            if (isOk(result)) {
                navigate('/');
            }

            return result;
        },
        [authenticate, navigate]
    );

    const onInvalidSubmit = useCallback((form: ReactHookForm<LoginForm>) => {
        const {
            formState: { errors, isSubmitted, isValid },
        } = form;

        let error = '';
        if (errors.password?.type && errors.username?.type) {
            error = 'Username and password are required';
        } else if (errors.password?.type) {
            error = 'Password is required';
        } else if (errors.username?.type) {
            error = 'Username is required';
        }

        if (isSubmitted && isValid) {
            error = 'Invalid username or password';
        }
        return error;
    }, []);

    const onSubmit = useSubmit({ form, onInvalidSubmit, onValidSubmit });

    return {
        dirtyFields,
        errors,
        isDirty,
        isSubmitSuccessful,
        isSubmitted,
        isSubmitting,
        isValid,
        onSubmit,
        register: form.register,
    };
}
