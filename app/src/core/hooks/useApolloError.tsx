import useSignOut from 'react-auth-kit/hooks/useSignOut';
import Result, { err } from 'true-myth/result';

import useToast from '~/core/hooks/useToast';
import {
    TryGetApolloErrorResponseMessage,
    getStatusCode,
    handle400Error,
    isApolloError,
    options400 as options400Type,
    options500 as options500Type,
} from '~/core/utils/apolloError';

export interface Options {
    options400?: options400Type;
    options500?: options500Type;
    reset?: () => void;
}

function useApolloError() {
    const { toast } = useToast();
    const signOut = useSignOut();

    return (error: any, { options400, reset }: Options = {}): Result<any, any> => {
        let responseError: string | undefined = 'Unknown error occurred';
        if (isApolloError(error)) {
            const statusCode = getStatusCode(error) ?? -1;
            if (statusCode > 399 && statusCode < 500) {
                responseError = handle400Error(error, {
                    ...options400,
                    redirectOn401: options400?.redirectOn401 ?? false,
                    signOut,
                });
            } else {
                const message = TryGetApolloErrorResponseMessage(error) ?? error.networkError?.message ?? 'Unknown error occurred';
                toast.error(message);
                setTimeout(() => {
                    reset?.();
                });
                responseError = message;
            }
        } else {
            toast.error('Unknown error occurred');
            setTimeout(() => {
                reset?.();
            });
        }

        if (responseError) {
            toast.error(responseError);
        }
        return err(responseError);
    };
}

export default useApolloError;
