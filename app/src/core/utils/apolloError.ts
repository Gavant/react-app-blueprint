import { ApolloError, ServerError } from '@apollo/client';
import {} from '@apollo/client/errors';
import Result, { err, map, mapOr, ok } from 'true-myth/src/result';

import { StatusCodeType, StatusCodes, StatusCodes400, StringErrorCodes } from '~/core/constants/errors';
import { kickToLogin } from '~/core/utils/redirect';
import { guard } from '~/core/utils/typescript';

export interface OptionsFor400Error {
    [StatusCodes.BadRequest]?: () => string;
    [StatusCodes.Conflict]?: () => string;
    [StatusCodes.Forbidden]?: () => string;
    [StatusCodes.Unauthorized]?: () => string;

    navigate?: () => void;
    redirectOn401?: boolean;
    signOut?: () => void;
}

export interface OptionsFor500Error {
    [StatusCodes.Unexpected]?: () => string;
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

export const isApolloServerError = (error: unknown): error is ServerError => {
    return guard<ServerError>(error, ['statusCode']);
};

export const GetErrorMessageForStringCode = (code: string) => {
    return (StringErrorCodes as Record<string, string>)[code];
};
export const TryGetApolloErrorResponseMessage = (error: ApolloError): Result<string, ApolloError> => {
    const networkError = error.networkError;
    if (isApolloServerError(networkError)) {
        return ok((networkError.result as { errors: ApolloError[] })?.errors[0].message);
    } else {
        return err(error);
    }
};

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

export const isCodeInHTTPErrorCodes = (code: number): code is StatusCodeType => {
    return Object.values(StatusCodes).includes(code as StatusCodeType);
};

export const isCodeA400Error = (code: number): code is StatusCodes400 => {
    return code > 399 && code < 500;
};

export const getStatusCode = (error: ApolloError): Result<StatusCodeType, ApolloError> => {
    if (guard<ServerError>(error.networkError, ['statusCode'])) {
        const statusCode = error.networkError.statusCode;
        if (isCodeInHTTPErrorCodes(statusCode)) {
            return ok(statusCode);
        } else {
            return err(error);
        }
    } else {
        return err(error);
    }
};

export const handle400Error = (
    error: ApolloError,
    { navigate, redirectOn401, signOut, ...opts }: OptionsFor400Error = { redirectOn401: false }
) => {
    if (TryGetApolloErrorEntity(error) === 'Stripe') {
        return TryGetApolloErrorResponseMessage(error);
    }

    const getErrorMessageFromCode = (code: StatusCodeType) => {
        if (isCodeInHTTPErrorCodes(code) && isCodeA400Error(code) && opts?.[code] && typeof opts?.[code] === 'function') {
            return (opts?.[code] as () => string)();
        } else if (code === StatusCodes.Unauthorized) {
            if (window.location.pathname === '/login') {
                return 'Invalid username or password';
            } else if (redirectOn401) {
                signOut?.();
                kickToLogin(window.location.pathname);
                return 'Unauthorized';
            }
            signOut?.();
        } else {
            return null;
        }
    };

    const statusCode = getStatusCode(error);
    const mapFn = (code: StatusCodeType) => {
        const errorFromCodeResult = getErrorMessageFromCode(code);
        if (errorFromCodeResult) {
            return errorFromCodeResult;
        } else {
            return mapOr(
                error.networkError?.message ?? 'Unknown error occurred',
                GetErrorMessageForStringCode,
                TryGetApolloErrorResponseMessage(error)
            );
        }
    };

    return map(mapFn, statusCode);
};

export const handle500Error = (error: ApolloError, { ...opts }: OptionsFor500Error = {}) => {
    const statusCode = getStatusCode(error);
    const mapFn = (code: number) => {
        if (code === 500 && opts?.[code] && typeof opts?.[code] === 'function') {
            return (opts?.[code] as () => string)();
        } else {
            return (error.networkError?.message ?? 'Unknown error occurred') as string;
        }
    };
    const stringCode = map(mapFn, statusCode);

    return stringCode;
};
