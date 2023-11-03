import { fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '@vitest/utils';
import { describe, expect, it, vi } from 'vitest';

import ColorModeToggle from '~/core/components/ColorModeToggle';
import { ColorModeContext } from '~/core/stores/themeMode';

const { navigate } = vi.hoisted(() => {
    return {
        navigate: vi.fn(),
    };
});

vi.mock('react-router', async () => {
    return {
        useLocation: vi.fn(),
        useNavigate: () => navigate,
    };
});

const toggleColorMode = vi.fn();

describe('Color Mode Toggle', () => {
    it('Should toggle the color mode provider on click', () => {
        renderWithTheme(
            <ColorModeContext.Provider value={{ toggleColorMode }}>
                <ColorModeToggle />
            </ColorModeContext.Provider>
        );
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(toggleColorMode).toHaveBeenCalled();
    });

    it('Should render the correct icon when light', () => {
        renderWithTheme(
            <ColorModeContext.Provider value={{ toggleColorMode }}>
                <ColorModeToggle />
            </ColorModeContext.Provider>
        );
        // Dependent on MUI test id
        expect(screen.getByTestId('Brightness4Icon')).toBeInTheDocument();
        expect(screen.queryByTestId('Brightness7Icon')).not.toBeInTheDocument();
    });

    it('Should render the correct icon when dark', () => {
        renderWithTheme(
            <ColorModeContext.Provider value={{ toggleColorMode }}>
                <ColorModeToggle />
            </ColorModeContext.Provider>,
            { palette: { mode: 'dark' } }
        );
        // Dependent on MUI test id
        expect(screen.queryByTestId('Brightness4Icon')).not.toBeInTheDocument();
        expect(screen.getByTestId('Brightness7Icon')).toBeInTheDocument();
    });

    it('Should should issue a context error when outside a provider', () => {
        vi.resetAllMocks();
        renderWithTheme(<ColorModeToggle />);
        // Dependent on MUI test id
        expect(screen.getByTestId('Brightness4Icon')).toBeInTheDocument();
    });
});
