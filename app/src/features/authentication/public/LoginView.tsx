import { Box, Container, Grid2 } from '@mui/material';
import { useEffect, useState } from 'react';
import Lottie from 'react-lottie-player';
import { useLocation } from 'react-router';
import { Link, useSearchParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import ColorModeToggle from '~/core/components/ColorModeToggle';
import GSplash from '~/core/components/G-splash';
import ShowHideTextAdornment from '~/core/components/ShowHideTextAdornment';
import SubmitButton from '~/core/components/SubmitButton';
import ImageUpload from '~/core/components/FileSelect';
import useFormFields from '~/core/hooks/useFormFields';
import useWindowSize from '~/core/hooks/useWindowSize';
import { UnauthorizedRootCss } from '~/features/app/constants/UnauthorizedRootCss';
import useLoginForm from '~/features/authentication/public/hooks/useLoginForm';
import FileList, { FileWithProgress } from '~/core/components/FileList';

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
    position: relative;
    box-shadow: -1px 3px 26px 3px rgba(0, 0, 0, 0.2);
    overflow: hidden;
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

    const [files, setFiles] = useState<FileWithProgress[]>([]);

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
                <div style={{ width: '500px' }}>
                    <ImageUpload
                        error={false}
                        id="bannerImage"
                        onChange={(files) => {
                            setFiles(files.map((file) => ({ file, progress: 100 })));
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            Drag & Drop files to upload
                            <SubmitButton color="primary" size="large" type="submit" variant="contained" sx={{ mt: 2 }}>
                                Select files
                            </SubmitButton>
                        </div>
                    </ImageUpload>
                    <FileList
                        files={files}
                        onRemove={(removedFile) => {
                            const newFiles = [...files];
                            const index = newFiles.findIndex(({ file }) => file === removedFile);
                            newFiles.splice(index, 1);
                            setFiles(newFiles);
                        }}
                    />
                </div>
            </FormBoxContainer>
        </>
    );
}

export default Login;
