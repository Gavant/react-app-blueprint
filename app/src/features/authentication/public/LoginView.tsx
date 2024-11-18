import { Box, Container, Grid2 } from '@mui/material';
import { useEffect, useState } from 'react';
import Lottie from 'react-lottie-player';
import { useLocation } from 'react-router';
import { Link as RouteLink, useSearchParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import LoginImage from '~/assets/images/login.jpg';
import logo from '~/assets/logo.png';
import ColorModeToggle from '~/core/components/ColorModeToggle';
import ShowHideTextAdornment from '~/core/components/ShowHideTextAdornment';
import SubmitButton from '~/core/components/SubmitButton';
import useFormFields from '~/core/hooks/useFormFields';
import { UnauthorizedRootCss } from '~/features/app/constants/UnauthorizedRootCss';
import useLoginForm from '~/features/authentication/public/hooks/useLoginForm';
const GridLeft = styled(Grid2)`
    text-align: left;
`;

const FormBoxContainer = styled(Box)`
    ${({ theme }) => css`
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
        background: ${theme.palette.common.white};
    `}
`;

const ImageBox = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 50%;
    height: 100%;
    background-position: 50% 20%;
    background-image: url(${LoginImage});
`;

const FormBox = styled(Box)`
    ${({ theme }) => css`
        display: flex;
        flex-direction: column;
        width: 50%;
        height: 100%;
        background: ${theme.palette.grey[100]};
        border-radius: ${theme.shape.borderRadius}px;
    `}
`;

const FullWidthBox = styled(Box)`
    width: calc(100% - 57px);
    padding: 0 ${({ theme }) => theme.spacing(10)};
`;

const CenteredContainer = styled(Container)`
    align-items: center;
    display: flex;
    height: 100vh;
    justify-content: center;
`;

const Form = styled(Box)`
    ${({ theme }) => css`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: ${theme.spacing(4)};
        height: 100%;
    `}
`;

const Logo = styled.img`
    max-width: 17rem;
    margin: 0 auto;
`;

const Link = styled(RouteLink)`
    ${({ theme }) => `${theme.typography.body2}`}
    color: ${({ theme }) => theme.palette.primary.main};

    &:visited {
        color: ${({ theme }) => theme.palette.primary.main};
    }

    &:hover {
        color: ${({ theme }) => theme.palette.primary.dark};
    }
`;

function Login() {
    // const theme = useTheme();
    // const { state } = useLocation();
    // const [searchParams] = useSearchParams();
    // const [showPasswordView, setShowPasswordView] = useState(false);
    // const redirect =
    //     (state?.redirect?.pathname ?? searchParams.get('redirect') ?? '/') + (state?.redirect?.search ? state.redirect?.search : '');
    // const { errors, onSubmit, register } = useLoginForm(redirect);
    // const { toast } = useToast();

    // const loginSubmit = useCallback(
    //     async (event: MouseEvent<HTMLButtonElement, Event>) => {
    //         const result = await onSubmit(event);
    //         if (isErr(result)) {
    //             toast.error(result.error as string);
    //         }
    //         return result;
    //     },
    //     [onSubmit, toast]
    // );
    const { state } = useLocation();
    const [searchParams] = useSearchParams();
    const [showPasswordView, setShowPasswordView] = useState(false);
    const redirect =
        (state?.redirect?.pathname ?? searchParams.get('redirect') ?? '/') + (state?.redirect?.search ? state.redirect?.search : '');
    const { control, onSubmit, schema } = useLoginForm(redirect);

    const { Text } = useFormFields({ control, schema });

    const [animationData, setAnimationData] = useState<object>();

    useEffect(() => {
        import('~/assets/lottie/landing.json').then(setAnimationData);
    }, []);

    return (
        <>
            <UnauthorizedRootCss />

            <FormBoxContainer>
                <ImageBox>
                    <Link to="/">
                        <Logo alt="" src={logo} />
                    </Link>
                </ImageBox>
                <FormBox>
                    <ColorModeToggle style={{ position: 'absolute', right: 10, top: 10 }} />
                    <CenteredContainer>
                        <Form as="form" noValidate>
                            <Box height="150px">
                                {animationData && (
                                    <Lottie
                                        animationData={animationData}
                                        loop={false}
                                        play
                                        segments={[0, 150]}
                                        speed={1.5}
                                        style={{
                                            height: 150,
                                        }}
                                    />
                                )}
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Text
                                    field="username"
                                    fullWidth
                                    label="Email"
                                    marginTop={0}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    style={{
                                        width: '350px',
                                    }}
                                />
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Text
                                    autoComplete="current-password"
                                    field="password"
                                    fullWidth
                                    label="Password"
                                    marginTop={0}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <ShowHideTextAdornment
                                                    IconButtonProps={{ color: 'secondary' }}
                                                    change={() => setShowPasswordView(!showPasswordView)}
                                                    visible={showPasswordView}
                                                />
                                            ),
                                        },
                                    }}
                                    style={{ marginTop: 0, width: '350px' }}
                                />
                            </Box>
                            <FullWidthBox sx={{ my: 2 }}>
                                <SubmitButton fullWidth onClick={onSubmit} size="medium" type="submit" variant="contained">
                                    Sign In
                                </SubmitButton>
                            </FullWidthBox>
                            <FullWidthBox>
                                <Grid2 container justifyContent="space-between">
                                    <GridLeft>
                                        <Link to="/forgot-password">Forgot password?</Link>
                                    </GridLeft>
                                    <Grid2>
                                        <Link to="/create-account">Create Account</Link>
                                    </Grid2>
                                </Grid2>
                            </FullWidthBox>
                        </Form>
                    </CenteredContainer>
                </FormBox>
            </FormBoxContainer>
        </>
    );
}

export default Login;
