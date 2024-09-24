import { signInFunctionParams } from 'react-auth-kit';

import { IUserData } from '~/features/authentication/public/hooks/useAuth';

interface SessionType {
    __typename?: string | undefined;
    AccessToken: string;
    ExpiresIn: number;
    RefreshToken?: string;
    TokenType: string;
}
export const createSessionData = (session: SessionType | undefined, username: string): signInFunctionParams<IUserData> => {
    return {
        auth: { token: session?.AccessToken ?? '' },
        // as of 3.1.3 react-auth-kit just straight blows up if it can't parse a token. In this case, the refresh token is encrypted
        // from cognito and so...guess what it does. We also have to give it something or....yeah. It blows up. So simply passing
        // it a valid token in the AccessToken as placeholder, and then storing the refresh token in a cookie elsewhere.
        refresh: session?.AccessToken ?? '',
        userState: { username },
    };
};
