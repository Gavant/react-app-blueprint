import { describe, expect, it } from 'vitest';

import ColorModeToggle from '../ColorModeToggle';

import { fireEvent, render, screen } from '~/vitest/utils';

describe('ColorModeToggle', () => {
    it('renders without crashing', () => {
        render(<ColorModeToggle />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('toggles color mode on click', () => {
        const { container } = render(<ColorModeToggle />);
        const button = screen.getByRole('button');
        const initialMode = container.querySelector('svg')?.getAttribute('data-testid');

        fireEvent.click(button);
        const toggledMode = container.querySelector('svg')?.getAttribute('data-testid');

        expect(initialMode).not.toBe(toggledMode);
    });

    it('uses the provided color prop', () => {
        const { container } = render(<ColorModeToggle color="primary" />);
        const svg = container.querySelector('svg');

        expect(svg).toHaveClass('MuiSvgIcon-colorPrimary');
    });
});
