import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton from '@mui/material/IconButton';
import { SvgIconPropsColorOverrides } from '@mui/material/SvgIcon/SvgIcon';
import { useColorScheme } from '@mui/material/styles';
import { OverridableStringUnion } from '@mui/types';
import styled from 'styled-components';

type MuiIconColor = OverridableStringUnion<
    'action' | 'disabled' | 'error' | 'info' | 'inherit' | 'primary' | 'secondary' | 'success' | 'warning',
    SvgIconPropsColorOverrides
>;

const ToggleButton = styled(IconButton)`
    padding: ${({ theme }) => theme.spacing(1.5)};
`;

export interface ColorModeToggleProps {
    color?: MuiIconColor;
}

function ColorModeToggle({ color = 'inherit' }: ColorModeToggleProps) {
    const { mode, setMode } = useColorScheme();

    return (
        <ToggleButton color="inherit" onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
            {mode === 'dark' ? <Brightness7Icon color={color} /> : <Brightness4Icon color={color} />}
        </ToggleButton>
    );
}

export default ColorModeToggle;
