import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import { default as jwt } from 'jsonwebtoken';
import { useContext, useEffect, useState } from 'react';
import useIsAuthenticatedAuthKit from 'react-auth-kit/hooks/useIsAuthenticated';

import { RefreshContext } from '~/features/authentication/public/stores/refresh';

// react-auth-kit seems to have a recurring/constant bug with useIsAuthenticated where the return value, isAuthenticated
// isn't a state value and thus isn't reactive in a desirable way causing components to fail to update to changes in authentication
// This hook is a tightly-coupled-to-refresh-tokens way to solve this as this is really the only way auth-kit can have the
// authenticated state change indirectly
export default function useIsAuthenticatedState() {
    const { subscribe, unsubscribe } = useContext(RefreshContext);
    const isAuthKitAuthenticated = useIsAuthenticatedAuthKit();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isAuthKitAuthenticated);

    useEffect(() => {
        const onTokenRefresh = () => {
            const token = Cookies.get('test');
            if (token) {
                const decodedToken = jwt.decode(token, { complete: true });
                const dateNow = new Date();
                // @ts-expect-error - unsure the best way to extend this. Don't know why the types lack it
                const exp = decodedToken.payload?.['exp'] as string;
                const expiration = dayjs(Number(exp ?? 0) * 1000);

                if (expiration.isValid() && expiration.toDate() >= dateNow) {
                    setIsAuthenticated(true);

                    // TODO: Add onRefresh callback?
                    return;
                }
            }
            setIsAuthenticated(false);
        };

        subscribe(onTokenRefresh);
        return () => unsubscribe(onTokenRefresh);
    }, [subscribe, unsubscribe]);

    return isAuthenticated;
}
