import { describe, expect, it, vi } from 'vitest';

import ShowHideTextAdornment from '~/core/components/ShowHideTextAdornment';
import { fireEvent, render, screen } from '~/vitest/utils';

describe('ShowHideTextAdornment', () => {
    it('renders the Visibility icon when visible is true', () => {
        const mockChange = vi.fn();
        render(<ShowHideTextAdornment change={mockChange} visible={true} />);
        const button = screen.getByLabelText('toggle password visibility');
        // Check if the rendered icon contains "Visibility"
        expect(button.innerHTML).toContain('Visibility');
    });

    it('renders the VisibilityOff icon when visible is false', () => {
        const mockChange = vi.fn();
        render(<ShowHideTextAdornment change={mockChange} visible={false} />);
        const button = screen.getByLabelText('toggle password visibility');
        expect(button.innerHTML).toContain('VisibilityOff');
    });

    it('calls change callback on click', () => {
        const mockChange = vi.fn();
        render(<ShowHideTextAdornment change={mockChange} visible={false} />);
        const button = screen.getByLabelText('toggle password visibility');
        fireEvent.click(button);
        expect(mockChange).toHaveBeenCalled();
    });

    it('calls change callback on mouse down', () => {
        const mockChange = vi.fn();
        render(<ShowHideTextAdornment change={mockChange} visible={true} />);
        const button = screen.getByLabelText('toggle password visibility');
        fireEvent.mouseDown(button);
        expect(mockChange).toHaveBeenCalled();
    });

    it('spreads additional props to the InputAdornment component', () => {
        const mockChange = vi.fn();
        render(<ShowHideTextAdornment change={mockChange} data-testid="adornment" visible={true} />);
        const adornment = screen.getByTestId('adornment');
        expect(adornment).toBeInTheDocument();
    });
});
