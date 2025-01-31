import { Box } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import Lottie from 'react-lottie-player';
import styled from 'styled-components';
import { replaceColor } from 'lottie-colorify';
import useToast from '~/core/hooks/useToast';
import { useTheme } from '@mui/material/styles';

const UploadContainer = styled.div<{ $accept: boolean; $error: boolean; $reject: boolean }>`
    width: 100%;
    background: ${({ theme }) => (theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[200])};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
    border: 2px dashed ${({ theme }) => (theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[300])};
    box-sizing: border-box;
    color: inherit;
    padding: ${({ theme }) => theme.spacing(4)};
    padding-top: 0;
    ${({ $accept, $error, $reject, theme }) => {
        if ($accept) {
            return `background: ${theme.palette.grey[800]}; color: ${theme.palette.common.white};`;
        }
        if ($reject || $error) {
            return `border-color: ${theme.palette.error.main};`;
        }
    }};
`;

interface FileSelectProps<T extends File> {
    children?: ReactNode;
    error: boolean;
    id: string;
    onChange: (files: T[]) => void;
    value?: File;
    accept?: Accept;
}

function FileSelect<T extends File>({ children, error, id, onChange, accept }: FileSelectProps<T>) {
    const { toast } = useToast();
    const theme = useTheme();

    const { getInputProps, getRootProps, isDragAccept, isDragReject } = useDropzone({
        accept: accept,
        onDropAccepted(files) {
            onChange(files as unknown as T[]);
        },
        onDropRejected: () => toast.error('Invalid File Type'),
    });

    const [animationData, setAnimationData] = useState<object>();

    useEffect(() => {
        import('~/assets/lottie/upload.json').then((data) => {
            setAnimationData(replaceColor('#98D7FF', theme.palette.primary.main, data.default));
        });
    }, [theme.palette.mode]);

    return (
        <UploadContainer $accept={isDragAccept} $error={error} $reject={isDragReject} {...getRootProps()}>
            <Box height="150px">
                {animationData && (
                    <Lottie
                        animationData={animationData}
                        loop={true}
                        play
                        style={{
                            height: 150,
                        }}
                    />
                )}
            </Box>
            <input {...getInputProps()} id={id} />
            {children}
        </UploadContainer>
    );
}

export default FileSelect;
