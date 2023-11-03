import { screen } from '@testing-library/react';
import { renderWithTheme } from '@vitest/utils';
import { describe, expect, it, vi } from 'vitest';

import LocalIcon from '~/core/components/LocalIcon'; // Adjust the import path as needed

vi.mock('styled-components', () => vi.importActual('styled-components/dist/styled-components.browser.esm.js'));

describe('LocalIcon', () => {
    it('renders with the provided props', () => {
        const src = 'example.png';
        renderWithTheme(<LocalIcon src={src} />);

        const imgElement = screen.getByRole('img', { hidden: true });
        expect(imgElement).toHaveAttribute('src', src);
        expect(imgElement).toHaveStyle('filter: invert(0);');
    });

    it('renders inverted when asked', () => {
        const src = 'example.png';
        renderWithTheme(<LocalIcon invert src={src} />);

        const imgElement = screen.getByRole('img', { hidden: true });
        expect(imgElement).toHaveAttribute('src', src);
        expect(imgElement).toHaveStyle('filter: invert(1);');
    });
});
