import { Box, Container, Grid2, Link } from '@mui/material';
import { MouseEvent, useCallback } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { isErr } from 'true-myth/result';

import ColorModeToggle from '~/core/components/ColorModeToggle';
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

const GridLeft = styled(Grid2)`
    text-align: left;
`;

const FormBox = styled(Box)`
    display: flex;
    flex-direction: column;
    margin-top: 3rem;
    width: 20rem;
`;

function LoginView() {
    const { control, onSubmit, schema } = useLoginForm('');

    const { Text } = useFormFields({ control, schema });
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
                <ColorModeToggle />
                <FadeElementInDown offset={4}>
                    <FormBox>
                        <Box component="form" noValidate>
                            <Box sx={{ mt: 2 }}>
                                <Text autoComplete="username" autoFocus color="secondary" field="username" fullWidth label="User Name" />
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Text
                                    autoComplete="current-password"
                                    color="secondary"
                                    field="password"
                                    fullWidth
                                    label="Password"
                                    slotProps={{ htmlInput: { maxLength: 50 } }}
                                    type="password"
                                />
                            </Box>
                            <Box sx={{ my: 2 }}>
                                <SubmitButton fullWidth onClick={loginSubmit} size="large" type="submit" variant="contained">
                                    Sign In
                                </SubmitButton>
                            </Box>
                            <Grid2 container justifyContent="space-between">
                                <GridLeft>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>
                                </GridLeft>
                                <Grid2>
                                    <Link href="#" variant="body2">
                                        Create Account
                                    </Link>
                                </Grid2>
                            </Grid2>
                        </Box>
                    </FormBox>
                </FadeElementInDown>
            </Root>
            <ToastBar />
        </>
    );
}

export default LoginView;
