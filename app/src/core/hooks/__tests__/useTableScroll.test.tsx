import { screen } from '@testing-library/react';
import { fireEvent, waitFor } from '@testing-library/react';
import { MutableRefObject } from 'react';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import useTableScroll from '../useTableScroll';

import { render } from '~/vitest/utils';

describe('useTableScroll', () => {
    let fetchMore: Mock;
    let pageRef: MutableRefObject<any>;

    beforeEach(() => {
        fetchMore = vi.fn();
        pageRef = { current: { limit: 10, offset: 0 } };
    });

    it('should fetch more data when scrolled to bottom', async () => {
        const TableScrollComponent = () => {
            useTableScroll({
                currentRowCount: 10,
                fetchMore,
                loading: false,
                pageRef,
                scrollableContainer: '[data-testid="custom-element"]',
                totalRowCount: 20,
            });

            return (
                <div data-testid="custom-element" style={{ height: '500px', overflow: 'scroll' }}>
                    <div style={{ height: '1000px' }}></div>
                </div>
            );
        };

        render(<TableScrollComponent />);

        const element = screen.getByTestId('custom-element');
        fireEvent.scroll(element, { target: { scrollY: 975 } });

        await waitFor(() => {
            expect(fetchMore).toHaveBeenCalledTimes(1);
        });
    });

    it('should not fetch more data if already loading', async () => {
        const TableScrollComponent = () => {
            useTableScroll({
                currentRowCount: 10,
                fetchMore,
                loading: true,
                pageRef,
                scrollableContainer: '[data-testid="custom-element"]',
                totalRowCount: 20,
            });

            return (
                <div data-testid="custom-element" style={{ height: '500px', overflow: 'scroll' }}>
                    <div style={{ height: '1000px' }}></div>
                </div>
            );
        };

        render(<TableScrollComponent />);

        const element = screen.getByTestId('custom-element');
        fireEvent.scroll(element, { target: { scrollY: 975 } });

        await waitFor(() => {
            expect(fetchMore).not.toHaveBeenCalled();
        });
    });

    it('should not fetch more data if all rows are loaded', async () => {
        const TableScrollComponent = () => {
            useTableScroll({
                currentRowCount: 20,
                fetchMore,
                loading: false,
                pageRef,
                scrollableContainer: '[data-testid="custom-element"]',
                totalRowCount: 20,
            });

            return (
                <div data-testid="custom-element" style={{ height: '500px', overflow: 'scroll' }}>
                    <div style={{ height: '1000px' }}></div>
                </div>
            );
        };

        render(<TableScrollComponent />);

        const element = screen.getByTestId('custom-element');
        fireEvent.scroll(element, { target: { scrollY: 975 } });

        await waitFor(() => {
            expect(fetchMore).not.toHaveBeenCalled();
        });
    });
});
