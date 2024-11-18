import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { SvgIconPropsColorOverrides } from '@mui/material/SvgIcon/SvgIcon';
import { useColorScheme } from '@mui/material/styles';
import { OverridableStringUnion } from '@mui/types';
import styled from 'styled-components';

type MuiIconColor = OverridableStringUnion<
    'error' | 'info' | 'inherit' | 'primary' | 'secondary' | 'success' | 'warning',
    SvgIconPropsColorOverrides
>;

const ToggleButton = styled(IconButton)`
    padding: ${({ theme }) => theme.spacing(1.5)};
`;

export interface ColorModeToggleProps extends IconButtonProps {
    color?: MuiIconColor;
}

function ColorModeToggle({ color = 'inherit', ...others }: ColorModeToggleProps) {
    const { mode, setMode } = useColorScheme();

    return (
        <ToggleButton color="inherit" onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} {...others}>
            {mode === 'dark' ? <Brightness7Icon color={color} /> : <Brightness4Icon color={color} />}
        </ToggleButton>
    );
}

export default ColorModeToggle;
