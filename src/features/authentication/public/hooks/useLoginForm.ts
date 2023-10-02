import { useCallback, useEffect, useState } from 'react';
import { FormState, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { isOk } from 'true-myth/result';

import useAuth from '~/features/authentication/public/hooks/useAuth';

interface LoginForm {
    password: string;
    username: string;
}

interface LoginFormDirtyAttrs {
    invalid: boolean;
    password: boolean;
    username: boolean;
}

export default function useLoginForm() {
    const [invalid, setInvalid] = useState(false);
    const [isDirty, setIsDirty] = useState<LoginFormDirtyAttrs>({ invalid: false, password: false, username: false });
    const { authenticate } = useAuth();
    const navigate = useNavigate();

    const errorText = (invalid: boolean, isDirty: LoginFormDirtyAttrs, formErrors: FormState<LoginForm>['errors']) => {
        if (invalid && !isDirty.invalid) {
            return 'Invalid username or password';
        }

        if (formErrors.password?.type && formErrors.username?.type) {
            return 'Username and password are required';
        }

        return formErrors.password?.type ? 'Password is required' : 'Username is required';
    };

    const {
        formState: { errors },
        handleSubmit,
        register,
        watch,
    } = useForm<LoginForm>();

    const hasError = useCallback(() => {
        return (invalid && !isDirty.invalid) || Boolean(errors.password?.type || errors.username?.type);
    }, [invalid, isDirty, errors.password?.type, errors.username?.type]);

    const onSubmit: SubmitHandler<LoginForm> = async (data: LoginForm, event) => {
        const { password, username } = data;

        event?.preventDefault();
        setIsDirty({ invalid: false, password: false, username: false });

        const result = await authenticate.signIn(username, password);

        if (isOk(result)) {
            navigate('/');
        } else {
            setInvalid(true);
            throw result;
        }
    };

    const onFormSubmit = handleSubmit(onSubmit);

    useEffect(() => {
        const subscription = watch((_, { name }) => {
            if (name) {
                !isDirty[name] && setIsDirty({ ...isDirty, invalid: true, [name]: true });
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    return {
        errors,
        errorText,
        hasError,
        invalid,
        isDirty,
        onFormSubmit,
        register,
    };
}
