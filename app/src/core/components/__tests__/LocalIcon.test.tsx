import { describe, expect, it } from 'vitest';

import LocalIcon from '../LocalIcon';

import { render } from '~/vitest/utils';

describe('LocalIcon', () => {
    it('renders without crashing', () => {
        const { container } = render(<LocalIcon src="test.png" />);
        expect(container).toBeInTheDocument();
    });

    it('applies className correctly', () => {
        const { container } = render(<LocalIcon className="test-class" src="test.png" />);
        // eslint-disable-next-line testing-library/no-container
        expect(container.querySelector('.test-class')).toBeInTheDocument();
    });

    it('renders image with correct src', () => {
        const { container } = render(<LocalIcon src="test.png" />);
        // eslint-disable-next-line testing-library/no-container
        const img = container.querySelector('img') as HTMLImageElement;
        expect(img.src).toContain('test.png');
    });
});
