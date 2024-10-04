import { useCallback } from 'react';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import Result, { err, unwrapOr } from 'true-myth/result';

import { StringErrorCodes } from '~/core/constants/errors';
import useToast from '~/core/hooks/useToast';
import {
    getStatusCode,
    handle400Error,
    handle500Error,
    isApolloError,
    OptionsFor400Error as options400Type,
    OptionsFor500Error as options500Type,
} from '~/core/utils/apolloError';

export interface Options {
    options400?: options400Type;
    options500?: options500Type;
    reset?: () => void;
}

function useApolloError() {
    const { toast } = useToast();
    const signOut = useSignOut();

    const showToastError = useCallback(
        (message: string, callback: (() => void) | undefined) => {
            toast.error(message);
            setTimeout(() => {
                callback?.();
            });
        },
        [toast]
    );

    return (error: any, { options400, reset }: Options = {}): Result<any, any> => {
        if (isApolloError(error)) {
            const statusCode = unwrapOr(-1, getStatusCode(error));
            if (statusCode > 399 && statusCode < 500) {
                return handle400Error(error, {
                    ...options400,
                    redirectOn401: options400?.redirectOn401 ?? false,
                    signOut,
                });
            } else {
                const result = handle500Error(error);
                const message = unwrapOr('Unknown error occurred', result) as string;
                showToastError(message, reset);
                return result;
            }
        } else {
            showToastError(StringErrorCodes.Unknown, reset);
            return err(StringErrorCodes.Unknown);
        }
    };
}

export default useApolloError;
