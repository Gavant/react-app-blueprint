import { describe, expect, it } from 'vitest';

import FadeElementInDown from '../FadeInDown';

import { render, waitFor } from '~/vitest/utils';

describe('FadeElementInDown', () => {
    it('renders children correctly', () => {
        const { getByText } = render(
            <FadeElementInDown offset={2}>
                <div>Test Content</div>
            </FadeElementInDown>
        );
        // eslint-disable-next-line testing-library/prefer-screen-queries
        expect(getByText('Test Content')).toBeInTheDocument();
    });

    it('applies initial styles correctly', () => {
        const { container } = render(
            <FadeElementInDown offset={2}>
                <div>Test Content</div>
            </FadeElementInDown>
        );
        const animatedDiv = container.firstChild as HTMLElement;
        expect(animatedDiv.style.opacity).toBe('0');
        expect(animatedDiv.style.transform).toBe('translateY(-2rem)');
    });

    it('applies final styles correctly', async () => {
        const { container } = render(
            <FadeElementInDown offset={2}>
                <div>Test Content</div>
            </FadeElementInDown>
        );
        const animatedDiv = container.firstChild as HTMLElement;
        await waitFor(() => {
            expect(animatedDiv.style.opacity).toBe('1');
        });
        await waitFor(() => {
            expect(animatedDiv.style.transform).toBe('translateY(0)');
        });
    });
});
