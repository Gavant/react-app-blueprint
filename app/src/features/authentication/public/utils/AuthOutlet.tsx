import * as React from 'react';
import { Navigate, Outlet } from 'react-router';

import useIsAuthenticatedState from '~/features/authentication/public/hooks/useAuthenticatedState';

interface AuthOutletProps {
    fallbackPath: string;
}

// Auth-kit replacement AuthOutlet.
// Auth-kit breaking more and more. Speculation that it isn't maintained anymore.
// If I have time I'm going to rip this out and switch
const AuthOutlet: React.FC<AuthOutletProps> = ({ fallbackPath }) => {
    const isAuthenticated = useIsAuthenticatedState();

    if (!isAuthenticated) {
        return <Navigate replace to={fallbackPath} />;
    }

    return <Outlet />;
};

export default AuthOutlet;
