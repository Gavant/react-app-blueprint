import * as React from 'react';
import { Navigate } from 'react-router';

import useIsAuthenticatedState from '~/features/authentication/public/hooks/useAuthenticatedState';

interface RequireAuthProps {
    children: JSX.Element;
    fallbackPath: string;
}

// Auth-kit replacement RequireAuth wrapper.
// Auth-kit breaking more and more. Speculation that it isn't maintained anymore.
// If I have time I'm going to rip this out and switch
const RequireAuth: React.FC<RequireAuthProps> = ({ children, fallbackPath = '/login' }) => {
    const isAuthenticated = useIsAuthenticatedState();

    if (!isAuthenticated) {
        return <Navigate replace to={fallbackPath} />;
    }

    return children;
};

export default RequireAuth;
