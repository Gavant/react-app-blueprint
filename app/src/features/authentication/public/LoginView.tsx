import { Box, Container, Grid, Link, TextField } from '@mui/material';
import { MouseEvent, useCallback } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { isErr } from 'true-myth/result';

import SubmitButton from '~/core/components/SubmitButton';
import ToastBar from '~/core/components/ToastBar';
import FadeElementInDown from '~/core/components/animation/FadeInDown';
import useToast from '~/core/hooks/useToast';
import useLoginForm from '~/features/authentication/public/hooks/useLoginForm';
const RootCss = createGlobalStyle`
    html, body, #root {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }
`;

const Root = styled(Container)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`;

const GridLeft = styled(Grid)`
    text-align: left;
`;

const FormBox = styled(Box)`
    display: flex;
    flex-direction: column;
    margin-top: 3rem;
    width: 20rem;
`;

function LoginView() {
    const { errors, onSubmit, register } = useLoginForm();
    const { toast } = useToast();

    const loginSubmit = useCallback(
        async (event: MouseEvent<HTMLButtonElement, Event>) => {
            const result = await onSubmit(event);
            if (isErr(result)) {
                toast.error(result.error);
            }
            return result;
        },
        [onSubmit, toast]
    );

    return (
        <>
            <RootCss />
            <Root component="main" maxWidth="xs">
                <FadeElementInDown offset={4}>
                    <FormBox>
                        <Box component="form" noValidate>
                            <Box sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    {...register('username', { required: 'Please enter a username' })}
                                    autoComplete="username"
                                    autoFocus
                                    error={!!errors.username?.type}
                                    label={`Username ${errors.username?.type ? '- Required' : ''}`}
                                />
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    {...register('password', { required: 'Please enter your password' })}
                                    autoComplete="current-password"
                                    error={!!errors.password?.type}
                                    label={`Password ${errors.password?.type ? '- Required' : ''}`}
                                    type="password"
                                />
                            </Box>
                            <Box sx={{ my: 2 }}>
                                <SubmitButton fullWidth onClick={loginSubmit} size="large" type="submit" variant="contained">
                                    Sign In
                                </SubmitButton>
                            </Box>
                            <Grid container justifyContent="flex-start">
                                <GridLeft item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>
                                </GridLeft>
                                <Grid item>
                                    <Link href="#" variant="body2">
                                        Create Account
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </FormBox>
                </FadeElementInDown>
            </Root>
            <ToastBar />
        </>
    );
}

export default LoginView;
