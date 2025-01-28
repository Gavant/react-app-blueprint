import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, LinearProgress } from '@mui/material';

import { InsertDriveFile } from '@mui/icons-material';
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
    width: 40px;
    height: 40px;
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
    width: 40px;
    height: 40px;
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
    file: File;
    progress: number;
    error?: boolean;
}

interface FileListProps {
    files: FileWithProgress[];
    onRemove: (file: File) => void;
}

function FileList({ files, onRemove, error }: FileListProps) {
    return (
        <FileListContainer>
            {files.map(({ file, progress }) => (
                <FileListItem key={`${file.name}-${file.size}`}>
                    <ListItemIcon>
                        {file.type.startsWith('image/') ? (
                            <FileListImage src={URL.createObjectURL(file)} alt={file.name} />
                        ) : (
                            <FileListIcon>
                                <InsertDriveFile />
                            </FileListIcon>
                        )}
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <FileListItemTextBox>
                                <FileListItemTitle variant="h5" fontSize={15} noWrap>
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
                                    <LinearProgress variant="determinate" value={progress} color={error ? 'error' : 'primary'} />
                                </ProgressContainer>
                                <Box>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{`${Math.round(progress)}%`}</Typography>
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
