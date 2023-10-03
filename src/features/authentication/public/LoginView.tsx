import { Alert, Box, Container, Grid, Link, TextField } from '@mui/material';
import { animated, config, useTransition } from 'react-spring';
import styled from 'styled-components';

import SubmitButton from '~/core/components/SubmitButton';
import ToastBar from '~/core/components/ToastBar';
import FadeElementInDown from '~/core/components/animation/FadeInDown';
import useLoginForm from '~/features/authentication/public/hooks/useLoginForm';

const AnimatedErrorBox = animated(Box);

const GridLeft = styled(Grid)`
    text-align: left;
`;

function LoginView() {
    const { errorMsg, errors, hasError, onSubmit, register } = useLoginForm();

    const transition = useTransition(hasError, {
        config: { ...config.stiff },
        enter: { opacity: 1 },
        from: { opacity: 0 },
        leave: { opacity: 0 },
    });

    return (
        <>
            <Container component="main" maxWidth="xs">
                {/* TODO center form vertically and horizontally */}
                <FadeElementInDown offset={4}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            mt: 6,
                            width: '20rem',
                        }}
                    >
                        {transition(
                            (style, item) =>
                                item && (
                                    <AnimatedErrorBox style={style} sx={{ mt: -6 }}>
                                        <Alert severity="error" variant="filled">
                                            {errorMsg}
                                        </Alert>
                                    </AnimatedErrorBox>
                                )
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
                                <SubmitButton fullWidth onClick={onSubmit} size="large" type="submit" variant="contained">
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
                    </Box>
                </FadeElementInDown>
            </Container>
            <ToastBar />
        </>
    );
}

export default LoginView;
