import { describe, expect, it } from 'vitest';

import SkeletonText from '../SkeletonText';

import { render, screen } from '~/vitest/utils';

describe('SkeletonText', () => {
    it('renders the value when provided', () => {
        render(<SkeletonText typographyVariant="body1" value="Test Value" />);
        const textElement = screen.getByText('Test Value');
        expect(textElement).toBeInTheDocument();
        expect(textElement).toHaveAttribute('data-testid', 'text');
    });

    it('renders the skeleton when value is undefined', () => {
        render(<SkeletonText typographyVariant="body1" value={undefined} />);
        const skeletonElement = screen.getByTestId('skeleton');
        expect(skeletonElement).toBeInTheDocument();
    });

    it('applies the correct typography variant', () => {
        render(<SkeletonText typographyVariant="h1" value="Test Value" />);
        const textElement = screen.getByText('Test Value');
        expect(textElement).toHaveClass('MuiTypography-h1');
    });

    it('applies custom className', () => {
        render(<SkeletonText className="custom-class" typographyVariant="body1" value="Test Value" />);
        const textElement = screen.getByText('Test Value');
        expect(textElement).toHaveClass('custom-class');
    });

    it('applies custom styles via sx prop', () => {
        render(<SkeletonText sx={{ color: 'red' }} typographyVariant="body1" value="Test Value" />);
        const textElement = screen.getByText('Test Value');
        expect(textElement).toHaveStyle('color: rgb(255, 0, 0);');
    });
});
