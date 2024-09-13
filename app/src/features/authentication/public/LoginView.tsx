import { Box, Container, Grid, Link } from '@mui/material';
import { MouseEvent, useCallback } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { isErr } from 'true-myth/result';

import SubmitButton from '~/core/components/SubmitButton';
import ToastBar from '~/core/components/ToastBar';
import FadeElementInDown from '~/core/components/animation/FadeInDown';
import useFormFields from '~/core/hooks/useFormFields';
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
    background: ${({ theme }) => theme.palette.common.white};
`;

function LoginView() {
    const { control, onSubmit } = useLoginForm('');

    const { Text } = useFormFields(control);
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
                        <Box component="form" noValidate style={{ backgroundColor: '#FFF' }}>
                            <Box sx={{ mt: 2 }}>
                                <Text
                                    autoComplete="username"
                                    autoFocus
                                    color="secondary"
                                    field="username"
                                    fullWidth
                                    label="User Name"
                                    required
                                />
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Text
                                    autoComplete="current-password"
                                    color="secondary"
                                    field="password"
                                    fullWidth
                                    label="Password"
                                    required
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
