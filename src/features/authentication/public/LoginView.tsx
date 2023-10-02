import { Alert, Box, Container, Grid, Link, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { animated, config, useSpring } from 'react-spring';
import styled from 'styled-components';

import AsyncButton from '~/core/components/AsyncButton';
import ToastBar from '~/core/components/ToastBar';
import FadeElementInDown from '~/core/components/animation/FadeInDown';
import useLoginForm from '~/features/authentication/public/hooks/useLoginForm';

const ErrorBox = styled(Box)`
    min-height: 4rem;
    margin-top: -4rem;
`;

// TODO componentize into ErrorBox
const AnimatedErrorBox = animated(ErrorBox);

const GridLeft = styled(Grid)`
    text-align: left;
`;

function LoginView() {
    const { errors, errorText, hasError, invalid, isDirty, onFormSubmit, register } = useLoginForm();
    const [loaded, setLoaded] = useState(false);

    const fadeInOut = useSpring({
        config: { ...config.stiff },
        from: { opacity: hasError() ? 0 : 1 },
        to: {
            opacity: hasError() ? 1 : 0,
        },
    });

    // TODO i believe there's a way to fix this with spring configs w/o extraneous useEffects...
    useEffect(() => {
        // Loading delay to help with react spring pop-in
        setTimeout(() => {
            setLoaded(true);
        }, 250);
    }, []);

    return (
        <>
            <Container component="main" maxWidth="xs">
                <FadeElementInDown offset={4}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '23rem',
                        }}
                    >
                        {loaded && (
                            <AnimatedErrorBox style={fadeInOut}>
                                <Alert severity="error" variant="filled">
                                    {errorText(invalid, isDirty, errors)}
                                </Alert>
                            </AnimatedErrorBox>
                        )}
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
                                {/* TODO why is fullWidth not allowed here? */}
                                <AsyncButton fullWidth onClick={onFormSubmit} size="large" type="submit" variant="contained">
                                    Sign In
                                </AsyncButton>
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
                    </Box>
                </FadeElementInDown>
            </Container>
            <ToastBar />
        </>
    );
}

export default LoginView;
