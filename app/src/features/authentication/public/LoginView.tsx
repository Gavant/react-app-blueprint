import { Box, Container, Grid2, decomposeColor } from '@mui/material';
import { useEffect, useState } from 'react';
import Lottie from 'react-lottie-player';
import { useLocation } from 'react-router';
import { Link, useSearchParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import LoginImage from '~/assets/images/login.jpg';
import logo from '~/assets/images/logo.png';
import ColorModeToggle from '~/core/components/ColorModeToggle';
import ShowHideTextAdornment from '~/core/components/ShowHideTextAdornment';
import SubmitButton from '~/core/components/SubmitButton';
import useFormFields from '~/core/hooks/useFormFields';
import useWindowSize from '~/core/hooks/useWindowSize';
import { UnauthorizedRootCss } from '~/features/app/constants/UnauthorizedRootCss';
import useLoginForm from '~/features/authentication/public/hooks/useLoginForm';
import GSplash from '~/core/components/G-splash';

const GridLeft = styled(Grid2)`
    text-align: left;
`;

const FormBoxContainer = styled(Box)`
    ${({ theme }) => css`
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
        background: ${theme.palette.background.default};
    `}
`;

const ImageBox = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 48%;
    height: 98%;
    background-position: 50% 20%;
    background-size: cover;
    border-radius: 10px;
    margin-top: 0.5%;
    margin-left: 0.5%;
    position: relative;box-shadow: -1px 3px 26px 3px rgba(0,0,0,0.2);
    overflow: hidden;
    /* &:after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: ${({ theme }) =>
        `rgba(${decomposeColor(theme.palette.common.black).values}, ${theme.palette.mode === 'dark' ? 0.2 : 0})`};
        z-index: 2;
    } */
    
    background: ${({ theme }) => theme.palette.mode === 'dark' ? '#081533' : 'rgba(221,230,250,0.81)'};
`;

const FormBox = styled(Box)`
    ${({ theme }) => css`
        display: flex;
        flex-direction: column;
        width: 50%;
        height: 100%;
        border-radius: ${theme.shape.borderRadius}px;
    `}
    ${({ theme }) => theme.breakpoints.down('md')} {
        width: 100%;
    }
`;

const FullWidthBox = styled(Box)`
    width: calc(100% - 57px);
`;

const CenteredContainer = styled(Container)`
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
`;

const Form = styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

const Logo = styled.img`
    max-width: 5rem;
    position: absolute;
    left: 20px;
    top: 20px;
    margin: 0 auto;
`;

function Login() {
    const { state } = useLocation();
    const [searchParams] = useSearchParams();
    const [showPasswordView, setShowPasswordView] = useState(false);
    const redirect =
        (state?.redirect?.pathname ?? searchParams.get('redirect') ?? '/') + (state?.redirect?.search ? state.redirect?.search : '');
    const { control, onSubmit, schema } = useLoginForm(redirect);

    const { Text } = useFormFields({ control, schema });

    const { isDesktop } = useWindowSize();

    const [animationData, setAnimationData] = useState<object>();

    useEffect(() => {
        import('~/assets/lottie/landing.json').then(setAnimationData);
    }, []);

    return (
        <>
            <UnauthorizedRootCss />

            <FormBoxContainer>
                {isDesktop && (
                    <ImageBox>
                        <GSplash />
                    </ImageBox>
                )}
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
                            <h3>Sign into Gavant</h3>
                            <Box sx={{ mt: 2 }}>
                                <Text
                                    field="username"
                                    fullWidth
                                    label="Email"
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
                                    style={{ width: '350px' }}
                                    type={showPasswordView ? 'text' : 'password'}
                                />
                            </Box>
                            <FullWidthBox sx={{ my: 2 }}>
                                <SubmitButton color="primary" fullWidth onClick={onSubmit} size="medium" type="submit" variant="contained">
                                    Sign In
                                </SubmitButton>
                            </FullWidthBox>
                            <FullWidthBox>
                                <Grid2 container justifyContent="space-between">
                                    <GridLeft>
                                        <Link color="dark" to="/forgot-password">
                                            Forgot password?
                                        </Link>
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
