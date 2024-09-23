import { ApolloError, ServerError } from '@apollo/client';
import {} from '@apollo/client/errors';
import Result, { err } from 'true-myth/result';

import { Options } from '~/core/hooks/useApolloError';
import { kickToLogin } from '~/core/utils/redirect';
import { guard } from '~/core/utils/typescript';

type ErrMessage = string | undefined;
export interface options400 {
    401?: () => ErrMessage;
    403?: () => ErrMessage;
    409?: () => ErrMessage;
    navigate?: () => void;
    redirectOn401?: boolean;
    signOut?: () => void;
}

export interface options500 {
    500?: () => ErrMessage;
}

/**
 * Checks if the error is an ApolloError
 *
 * @param {unknown} error
 * @return {*}  {error is ApolloError}
 */
export const isApolloError = (error: unknown): error is ApolloError => {
    return guard<ApolloError>(error, ['graphQLErrors', 'networkError']);
};

export const TryGetApolloErrorResponseMessage = (error: ApolloError): string | null =>
    ((error.networkError as ServerError)?.result as { errors: ApolloError[] })?.errors?.[0]?.message;

export const TryGetApolloErrorEntity = (error: ApolloError): string | null => {
    const networkError = error.networkError;
    if (
        networkError &&
        'result' in networkError &&
        networkError.result &&
        typeof networkError.result === 'object' &&
        'errors' in networkError.result &&
        networkError.result.errors.length > 0
    ) {
        const firstError = networkError.result.errors[0];
        if (firstError.extensions && typeof firstError.extensions === 'object' && 'entity' in firstError.extensions) {
            return firstError.extensions.entity as string;
        }
    }
    return null;
};
export const getStatusCode = (error: ApolloError): number | null => (error?.networkError as ServerError)?.statusCode;

// TODO: Want to come up with a better pattern for error handling than these error specific handlers. At some point the decision
// was made to have the FE manage the error messages, but than that seems to have changed at some point because the BE sends full
// errors back in PLUT with user presentable error text.
export const handle400Error = (
    error: ApolloError,
    { navigate, redirectOn401, signOut, ...opts }: options400 = { redirectOn401: false }
): string | undefined => {
    if (TryGetApolloErrorEntity(error) === 'Stripe') {
        return TryGetApolloErrorResponseMessage(error) as string;
    }
    const statusCode = getStatusCode(error);
    switch (statusCode) {
        case 409:
            if (opts?.[statusCode] && typeof opts?.[statusCode] === 'function') {
                return (opts?.[statusCode] as () => ErrMessage)();
            }
            switch (TryGetApolloErrorResponseMessage(error)) {
                case 'UsernameExistsException':
                case 'EmailAlreadyInUse':
                    return 'Email address already in use';
                default:
                    return error.networkError?.message ?? 'Unknown error occurred';
            }
        case 403:
            if (opts?.[statusCode] && typeof opts?.[statusCode] === 'function') {
                return (opts?.[statusCode] as () => ErrMessage)();
            }
            switch (TryGetApolloErrorResponseMessage(error)) {
                case 'ForgotPasswordLimitExceeded':
                case 'PasswordAttemptLimitExceeded':
                case 'LimitExceededException':
                    return 'Attempt limit exceeded. Try again in a few minutes.';
                case 'ExpiredCodeException':
                    return 'Reset link expired. Please request a new one';
                case 'IncorrectCurrentPassword':
                    return 'Invalid username or password. Please update and try again.';
                case 'TemporaryPasswordExpired':
                    return 'Temporary password has expired, a new temporary password has been sent to your email.';
                case 'NewPasswordRequired':
                    navigate && typeof navigate === 'function' && navigate();
                    return 'New password is required';
                default:
                    return error.networkError?.message ?? 'Unknown error occurred';
            }
        case 401:
            if (opts?.[statusCode] && typeof opts?.[statusCode] === 'function') {
                return (opts?.[statusCode] as () => ErrMessage)();
            }
            switch (TryGetApolloErrorResponseMessage(error)) {
                case 'Unauthorized':
                    if (window.location.pathname === '/login') {
                        return 'Invalid username or password';
                    } else if (redirectOn401) {
                        signOut?.();
                        kickToLogin(window.location.pathname);
                        return 'Unauthorized';
                    }
                    signOut?.();
                    return undefined;
                default:
                    return error.networkError?.message ?? 'Unknown error occurred';
            }
        case 400:
            switch (TryGetApolloErrorResponseMessage(error)) {
                case 'entityNotFound':
                    return 'Not found';
                default:
                    return 'Unknown Error';
            }
        default:
            return error.networkError?.message ?? 'Unknown error occurred';
    }
};

export const handle500Error = (error: ApolloError, { ...opts }: options500 = {}): string | undefined => {
    const statusCode = getStatusCode(error);
    switch (statusCode) {
        case 500:
        default:
            if (statusCode === 500 && opts?.[statusCode] && typeof opts?.[statusCode] === 'function') {
                return (opts?.[statusCode] as () => ErrMessage)();
            }
            switch (TryGetApolloErrorResponseMessage(error)) {
                default:
                    return error.networkError?.message ?? 'Unknown error occurred';
            }
    }
};

export const handleError = (error: any, { options400, reset }: Options = {}): Result<any, any> => {
    let responseError: string | undefined = 'Unknown error occurred';
    if (isApolloError(error)) {
        const statusCode = getStatusCode(error) ?? -1;
        if (statusCode > 399 && statusCode < 500) {
            responseError = handle400Error(error, {
                ...options400,
                redirectOn401: options400?.redirectOn401 ?? false,
            });
        } else {
            const message = TryGetApolloErrorResponseMessage(error) ?? error.networkError?.message ?? 'Unknown error occurred';
            setTimeout(() => {
                reset?.();
            });
            responseError = message;
        }
    } else {
        setTimeout(() => {
            reset?.();
        });
    }

    if (responseError) {
        //toast.error(responseError);
    }
    return err(responseError);
};
