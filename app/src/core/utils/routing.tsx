import { CircularProgress } from '@mui/material';
import React from 'react';
import RequireAuth from 'react-auth-kit';

export const Suspense = (el: React.ReactElement) => {
    return <React.Suspense fallback={<CircularProgress />}>{el}</React.Suspense>;
};

export const Authenticate = (el: React.ReactElement, loginPath = '/login') => {
    return <RequireAuth loginPath={loginPath}>{el}</RequireAuth>;
};
