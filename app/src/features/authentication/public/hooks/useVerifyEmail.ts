import { useMutation } from '@apollo/client';
import { Result } from 'true-myth';
import { ok } from 'true-myth/result';

import useApolloError from '~/core/hooks/useApolloError';
import { ForgotPasswordMutation, MutationForgotPasswordArgs } from '~/core/types/generated/graphql';
import { VERIFY_EMAIL_FORGOT_PASSWORD } from '~/features/authentication/graphql/authentication.gql';

export default function useForgotPassword() {
    const apolloError = useApolloError();
    const [forgotPasswordMutation, { loading, reset }] = useMutation<ForgotPasswordMutation, MutationForgotPasswordArgs>(
        VERIFY_EMAIL_FORGOT_PASSWORD
    );

    const verifyEmail = async (username: string): Promise<Result<boolean, string>> => {
        try {
            await forgotPasswordMutation({ variables: { username } });
            // If the query completes say it worked. Which I believe the backend is doing. But further obfuscation
            return ok(true);
        } catch (error: unknown) {
            return apolloError(error, { reset });
        }
    };

    return {
        loading,
        verifyEmail,
    };
}
