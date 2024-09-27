import Cookies from 'js-cookie';
import createRefresh from 'react-auth-kit/createRefresh';

import { client } from '~/core/stores/apollo';
import { RefreshTokenMutation, RefreshTokenMutationVariables } from '~/core/types/generated/graphql';
import { REFRESH_TOKEN } from '~/features/authentication/graphql/authentication.gql';

export const refreshApiCallback = async () => {
    try {
        const refreshToken = Cookies.get(import.meta.env.VITE_REFRESH_COOKIE_NAME);
        const result = await client.mutate<RefreshTokenMutation, RefreshTokenMutationVariables>({
            mutation: REFRESH_TOKEN,
            variables: { refreshToken: refreshToken ?? '' },
        });

        return {
            isSuccess: true,
            newAuthToken: result?.data?.refreshToken?.AccessToken ?? '',
            newAuthTokenExpireIn: 10,
            newRefreshTokenExpiresIn: 60,
        };
    } catch (error) {
        console.error(error);
        return {
            isSuccess: false,
            newAuthToken: '',
        };
    }
};

export const refresh = createRefresh({
    interval: 10, // minutes
    refreshApiCallback,
});
