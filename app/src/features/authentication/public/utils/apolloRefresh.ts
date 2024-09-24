import { createRefresh } from 'react-auth-kit';

import { client } from '~/core/stores/apollo';
import { Mutation, MutationRefreshTokenArgs } from '~/core/types/generated/graphql';
import { REFRESH_TOKEN } from '~/features/authentication/graphql/authentication.gql';

// TODO: :not-sure-if: Not sure if this is working :hmmm:
export const refresh = createRefresh({
    interval: 60,
    refreshApiCallback: async ({ authToken, refreshToken }) => {
        try {
            const result = await client.mutate<Mutation['refreshToken'], MutationRefreshTokenArgs>({
                context: { headers: { token: `Bearer ${authToken}` } },
                mutation: REFRESH_TOKEN,
                variables: { refreshToken: refreshToken ?? '' },
            });
            return {
                isSuccess: true,
                newAuthToken: result?.data?.AccessToken ?? '',
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
    },
});
