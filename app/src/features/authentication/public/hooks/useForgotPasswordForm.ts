import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { isOk, ok } from 'true-myth/result';

import useSubmit, { ReactHookForm } from '~/core/hooks/useSubmit';
import useToast from '~/core/hooks/useToast';
import useVerifyEmail from '~/features/authentication/public/hooks/useVerifyEmail';
import { ForgotPasswordForm, ForgotPasswordSchema } from '~/features/schemas/ForgoPassword';

export default function useForgotPasswordForm() {
    const { verifyEmail } = useVerifyEmail();
    const navigate = useNavigate();
    const { toast } = useToast();

    const form = useForm<ForgotPasswordForm>({
        resolver: zodResolver(ForgotPasswordSchema),
    });

    const {
        control,
        formState: { errors },
    } = form;

    const onValidSubmit = useCallback(
        async (data: ForgotPasswordForm) => {
            const { username } = data;

            const result = await verifyEmail(username);
            if (isOk(result)) {
                navigate(`/forgot-password?success=${result.value}`);
            } else {
                navigate('/forgot-password?success=false');
            }
            return ok(data);
        },
        [navigate, verifyEmail]
    );

    const onInvalidSubmit = (form: ReactHookForm<ForgotPasswordForm>) => {
        const {
            formState: { errors },
        } = form;

        let error = '';
        if (errors.username?.type) {
            error = errors.username.message as string;
        }

        toast.error(error);
        return error;
    };

    const onSubmit = useSubmit({ form, onInvalidSubmit, onValidSubmit });

    return {
        control,
        errors,
        onSubmit,
        register: form.register,
        schema: ForgotPasswordSchema,
    };
}
