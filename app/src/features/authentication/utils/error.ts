import { ApolloError } from '@apollo/client';
import Result, { err, mapOr } from 'true-myth/src/result';

import { StatusCodeType } from '~/core/constants/errors';
import { Toast } from '~/core/stores/toastContext';
import { getStatusCode, handle400Error, handle500Error } from '~/core/utils/apolloError';

interface HandleAuthErrorState {
    navigate: (route: string) => void;
    password?: string;
    toast: Toast;
    username: string;
}

export function handleApolloAuthError(error: ApolloError, { navigate, password, username }: HandleAuthErrorState) {
    const nav = () =>
        navigate(
            `/reset-password?email=${encodeURIComponent(username)}&temporary_password=${encodeURIComponent(password ?? '')}&from_login=true`
        );

    const mapFn = (code: StatusCodeType): Result<string, ApolloError> => {
        if (code > 399 && code < 500) {
            return handle400Error(error, { navigate: nav });
        } else if (code > 499 && code < 600) {
            return handle500Error(error);
        } else {
            return err(error);
        }
    };
    //Get error as as string from the status code, or fallback to just returning the entire error.
    // If were able to get the status code, we can then map over it to ge the error message
    return mapOr(err(error), mapFn, getStatusCode(error));
}
