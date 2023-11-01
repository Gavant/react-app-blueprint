import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton from '@mui/material/IconButton';
import { SvgIconPropsColorOverrides } from '@mui/material/SvgIcon/SvgIcon';
import { useTheme } from '@mui/material/styles';
import { OverridableStringUnion } from '@mui/types';
import { useContext } from 'react';
import styled from 'styled-components';

import { ColorModeContext } from '~/core/stores/themeMode';

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
    const theme = useTheme();
    const context = useContext(ColorModeContext);
    if (context === undefined) {
        throw new Error('ColorModeToggle must be used within a ThemeProvider');
    }

    return (
        <ToggleButton color="inherit" onClick={context.toggleColorMode}>
            {theme.palette.mode === 'dark' ? <Brightness7Icon color={color} /> : <Brightness4Icon color={color} />}
        </ToggleButton>
    );
}

export default ColorModeToggle;
