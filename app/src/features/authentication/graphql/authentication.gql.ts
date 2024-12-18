import { gql } from '@apollo/client';

export const LOGIN = gql`
    mutation Login($input: LoginInput!) {
        login(input: $input) {
            AccessToken
            RefreshToken
            TokenType
            ExpiresIn
        }
    }
`;

export const LOGOUT = gql`
    mutation Logout($refreshToken: String!) {
        # logout returns a plain string on success - we don't need to parse it
        logout(refreshToken: $refreshToken)
    }
`;

export const REFRESH_TOKEN = gql`
    mutation RefreshToken($refreshToken: String!) {
        refreshToken(refreshToken: $refreshToken) {
            AccessToken
            TokenType
            ExpiresIn
        }
    }
`;

export const VERIFY_EMAIL_FORGOT_PASSWORD = gql`
    mutation ForgotPassword($username: String!) {
        forgotPassword(username: $username)
    }
`;

export const RESET_PASSWORD_CONFIRMATION_CODE = gql`
    mutation ConfirmForgotPassword($username: String!, $confirmationCode: String!, $newPassword: String!) {
        confirmForgotPasswordAndSignIn(input: { username: $username, newPassword: $newPassword, confirmationCode: $confirmationCode }) {
            AccessToken
            RefreshToken
            TokenType
            ExpiresIn
        }
    }
`;

export const COMPLETE_ACCOUNT_SIGN_UP = gql`
    mutation ConfirmAccount($username: String!, $temporaryPassword: String!, $newPassword: String!) {
        completeSignUp(input: { username: $username, newPassword: $newPassword, temporaryPassword: $temporaryPassword }) {
            AccessToken
            TokenType
            ExpiresIn
            RefreshToken
        }
    }
`;

export const CREATE_ACCOUNT = gql`
    mutation CreateAccount($email: String!, $firstName: String!, $lastName: String!, $dateOfBirth: Date!) {
        addUser(input: { email: $email, firstName: $firstName, lastName: $lastName, dateOfBirth: $dateOfBirth }) {
            id
        }
    }
`;
