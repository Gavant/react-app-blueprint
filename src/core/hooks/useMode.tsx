import { useTheme } from '@mui/material/styles';

function useMode() {
    const theme = useTheme();

    return theme.palette.mode;
}

export default useMode;
