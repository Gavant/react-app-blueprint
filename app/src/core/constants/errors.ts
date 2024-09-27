export const StringErrorCodes = {
    EmailAlreadyInUse: 'Email address already in use',
    EntityNotFound: 'Not found',
    ExpiredCodeException: 'Reset link expired. Please request a new one',
    ForgotPasswordLimitExceeded: 'Attempt limit exceeded. Try again in a few minutes.',
    IncorrectCurrentPassword: 'Invalid username or password. Please update and try again.',
    LimitExceededException: 'Attempt limit exceeded. Try again in a few minutes.',
    NewPasswordRequired: 'New password is required',
    PasswordAttemptLimitExceeded: 'Attempt limit exceeded. Try again in a few minutes.',
    TemporaryPasswordExpired: 'Temporary password has expired, a new temporary password has been sent to your email.',
    Unauthorized: 'Invalid username or password',
    Unknown: 'Unknown error occurred',
    UsernameExistsException: 'Email address already in use',
} as const;

export enum StatusCodes {
    BadRequest = 400,
    Conflict = 409,
    Forbidden = 403,
    Unauthorized = 401,
    Unexpected = 500,
}

export type StatusCodeType = `${Extract<StatusCodes, number>}` extends `${infer N extends number}` ? N : never;

export type StatusCodes400 = StatusCodes.Conflict | StatusCodes.Forbidden | StatusCodes.Unauthorized;
