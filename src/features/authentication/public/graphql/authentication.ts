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
