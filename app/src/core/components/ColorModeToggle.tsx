import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { SvgIconPropsColorOverrides } from '@mui/material/SvgIcon/SvgIcon';
import { useTheme } from '@mui/material/styles';
import { OverridableStringUnion } from '@mui/types';
import { useContext } from 'react';
import { styled } from 'styled-components';

import { ColorModeContext } from '~/core/stores/themeMode';

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
    const theme = useTheme();
    const context = useContext(ColorModeContext);
    if (context === undefined) {
        throw new Error('ColorModeToggle must be used within a ThemeProvider');
    }

    return (
        <ToggleButton
            aria-label="toggle-color-mode"
            color="inherit"
            onClick={() => {
                context.toggleColorMode();
            }}
            {...others}
        >
            {theme.palette.mode === 'dark' ? <Brightness7Icon color={color} /> : <Brightness4Icon color={color} />}
        </ToggleButton>
    );
}

export default ColorModeToggle;
