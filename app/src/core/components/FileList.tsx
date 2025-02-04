import { InsertDriveFile } from '@mui/icons-material';
import { Box, LinearProgress, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import styled from 'styled-components';

const FileListContainer = styled(List)`
    width: 100%;
    margin-top: ${({ theme }) => theme.spacing(2)};
`;

const FileListItem = styled(ListItem)`
    display: flex;
    border: 1px solid ${({ theme }) => theme.palette.divider};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
    margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const FileListImage = styled.img`
    width: ${({ theme }) => theme.sizing(5)};
    height: ${({ theme }) => theme.sizing(5)};
    object-fit: cover;
    margin-right: ${({ theme }) => theme.spacing(2)};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
`;

const FileListItemTextBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;

const FileListIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${({ theme }) => theme.sizing(5)};
    height: ${({ theme }) => theme.sizing(5)};
    margin-right: ${({ theme }) => theme.spacing(2)};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
`;

const FileListItemTitle = styled(Typography)`
    max-width: 80%;
`;

const ProgressContainer = styled.div`
    margin-right: ${({ theme }) => theme.spacing(1)};
    width: 100%;
`;

export interface FileWithProgress {
    error?: boolean;
    file: File;
    progress: number;
}

interface FileListProps {
    files: FileWithProgress[];
}

function FileList({ files }: FileListProps) {
    return (
        <FileListContainer>
            {files.map(({ error, file, progress }) => (
                <FileListItem key={`${file.name}-${file.size}`}>
                    <ListItemIcon>
                        {file.type.startsWith('image/') ? (
                            <FileListImage alt={file.name} src={URL.createObjectURL && URL.createObjectURL(file)} />
                        ) : (
                            <FileListIcon>
                                <InsertDriveFile role="img" />
                            </FileListIcon>
                        )}
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <FileListItemTextBox>
                                <FileListItemTitle fontSize={15} noWrap variant="h5">
                                    {file.name}
                                </FileListItemTitle>

                                <Typography
                                    fontSize={15}
                                    sx={{ display: 'flex' }}
                                >{`${(file.size / 1024 / 1024).toFixed(2)} MB`}</Typography>
                            </FileListItemTextBox>
                        }
                        secondary={
                            <FileListItemTextBox>
                                <ProgressContainer>
                                    <LinearProgress color={error ? 'error' : 'primary'} value={progress} variant="determinate" />
                                </ProgressContainer>
                                <Box>
                                    <Typography sx={{ color: 'text.secondary' }} variant="body2">{`${Math.round(progress)}%`}</Typography>
                                </Box>
                            </FileListItemTextBox>
                        }
                    />
                </FileListItem>
            ))}
        </FileListContainer>
    );
}

export default FileList;
