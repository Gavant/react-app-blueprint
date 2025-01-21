import { Box, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import Lottie from 'react-lottie-player';
import { Link } from 'react-router-dom';
import { css, styled } from 'styled-components';

import LoginImage from '~/assets/images/forgot-password.jpg';
import ColorModeToggle from '~/core/components/ColorModeToggle';
import GSplash from '~/core/components/G-splash';
import SubmitButton from '~/core/components/SubmitButton';
import useFormFields from '~/core/hooks/useFormFields';
import useWindowSize from '~/core/hooks/useWindowSize';
import { UnauthorizedRootCss } from '~/features/app/constants/UnauthorizedRootCss';
import useForgotPasswordForm from '~/features/authentication/public/hooks/useForgotPasswordForm';

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
    background-image: url(${LoginImage});
    border-radius: 10px;
    margin-top: 0.5%;
    margin-left: 0.5%;
    position: relative;
    background: ${({ theme }) => (theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.main)};
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

const InfoText = styled(Box)`
    ${({ theme }) => css`
        text-align: center;
        max-width: 350px;
        margin-bottom: ${theme.spacing(3)};
        color: ${theme.palette.text.secondary};
    `}
`;

function ForgotPasswordView() {
    const { control, onSubmit, schema } = useForgotPasswordForm();
    const { Text } = useFormFields({ control, schema });
    const { isDesktop } = useWindowSize();
    const [animationData, setAnimationData] = useState<object>();

    useEffect(() => {
        import('~/assets/lottie/ForgotPassword.json').then(setAnimationData);
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
                            <InfoText>Enter your email address and we&apos;ll send you instructions to reset your password.</InfoText>
                            <Box sx={{ mt: 2, width: '350px' }}>
                                <Text field="username" fullWidth label="Email" slotProps={{ inputLabel: { shrink: true } }} />
                            </Box>
                            <Box sx={{ mb: 2, mt: 3, width: '350px' }}>
                                <SubmitButton fullWidth onClick={onSubmit} size="medium" type="button" variant="contained">
                                    Reset Password
                                </SubmitButton>
                            </Box>
                            <Box>
                                <Link to="/login">Back to Login</Link>
                            </Box>
                        </Form>
                    </CenteredContainer>
                </FormBox>
            </FormBoxContainer>
        </>
    );
}

export default ForgotPasswordView;
