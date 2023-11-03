import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import SkeletonText from '~/core/components/SkeletonText'; // Adjust the import path as needed
describe('SkeletonText', () => {
    it('renders with provided value', () => {
        const value = 'Test Value';
        const typographyVariant = 'body1';

        const { getByText } = render(
            <ThemeProvider theme={createTheme()}>
                <SkeletonText typographyVariant={typographyVariant} value={value} />
            </ThemeProvider>
        );

        const textElement = getByText('Test Value');

        expect(textElement).toBeInTheDocument();
    });

    it('renders a Skeleton when value is not provided', () => {
        const typographyVariant = 'body1';

        const { getByTestId } = render(
            <ThemeProvider theme={createTheme()}>
                <SkeletonText typographyVariant={typographyVariant} value={undefined} />
            </ThemeProvider>
        );

        const skeletonElement = getByTestId('skeleton-text');

        expect(skeletonElement).toBeInTheDocument();
    });
});
