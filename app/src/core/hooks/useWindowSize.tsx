import { useTheme } from '@mui/material/styles';
import { useContext } from 'react';

import { WindowSize, WindowSizeContext } from '~/core/stores/windowSizeContext';

export interface UseWindowSize {
    isDesktop: boolean;
    isMobile: boolean;
    size: WindowSize;
}

function useWindowSize(): UseWindowSize {
    const theme = useTheme();
    const context = useContext(WindowSizeContext);

    if (!context) {
        throw new Error('useWindowSize must be used within a WindowSizeProvider');
    }

    const { size } = context;

    return {
        isDesktop: theme.breakpoints.values.md <= size.width,
        isMobile: theme.breakpoints.values.md > size.width,
        size,
    };
}

export default useWindowSize;
