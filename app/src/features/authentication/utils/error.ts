import { ApolloError } from '@apollo/client';
import Result, { err } from 'true-myth/result';

import { Toast } from '~/core/stores/toastContext';
import { getStatusCode, handle400Error, handle500Error } from '~/core/utils/apolloError';

interface HandleAuthErrorState {
    navigate: (route: string) => void;
    password?: string;
    toast: Toast;
    username: string;
}

export function handleApolloAuthError<T>(
    error: ApolloError,
    { navigate, password, username }: HandleAuthErrorState
): Result<T, string | undefined> {
    const nav = () =>
        navigate(
            `/reset-password?email=${encodeURIComponent(username)}&temporary_password=${encodeURIComponent(password ?? '')}&from_login=true`
        );
    const statusCode = getStatusCode(error) ?? -1;
    if (statusCode > 399 && statusCode < 500) {
        return err(handle400Error(error, { navigate: nav }));
    }
    if (statusCode > 499 && statusCode < 600) {
        return err(handle500Error(error));
    } else {
        return err('Unknown error occurred');
    }
}
