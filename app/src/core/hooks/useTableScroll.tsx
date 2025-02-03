import { Virtualizer } from '@tanstack/react-virtual';
import { MutableRefObject, useCallback, useEffect, useRef } from 'react';

import { Page } from '~/core/types/generated/graphql';

interface QueryOnScroll {
    currentRowCount: number;
    fetchHeight?: number;
    fetchMore: () => void;
    loading: boolean;
    pageRef: MutableRefObject<Page>;
    scrollableContainer?: string;
    totalRowCount: number;
}

function useTableScroll<P extends Page>({
    currentRowCount,
    fetchHeight = 50,
    fetchMore,
    loading,
    pageRef,
    scrollableContainer = 'body',
    totalRowCount,
}: QueryOnScroll) {
    const tableContainerRef = useRef<HTMLDivElement | null>(null);
    const rowVirtualizerInstanceRef = useRef<null | Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

    const getScrollContainer = useCallback(() => {
        return document.querySelector(scrollableContainer) ?? tableContainerRef.current;
    }, [scrollableContainer]);

    //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
    const fetchMoreOnBottomReached = useCallback(async () => {
        const container = getScrollContainer();
        if (container) {
            const { clientHeight, scrollHeight, scrollTop } = container;
            //once the user has scrolled within (fetchHeight)px of the bottom of the table, fetch more data if we can
            if (scrollHeight - scrollTop - clientHeight < fetchHeight && !loading && currentRowCount < totalRowCount) {
                pageRef.current.offset = currentRowCount;
                await fetchMore();
            }
        }
    }, [getScrollContainer, fetchHeight, loading, currentRowCount, totalRowCount, pageRef, fetchMore]);

    useEffect(() => {
        pageRef.current = { limit: pageRef?.current?.limit ?? 10, offset: 0 } as P;
    }, [pageRef]);

    useEffect(() => {
        const container = getScrollContainer();
        const onScroll = () => {
            fetchMoreOnBottomReached();
        };
        container?.addEventListener('scroll', onScroll);

        return () => container?.removeEventListener('scroll', onScroll);
    }, [fetchMoreOnBottomReached, getScrollContainer, scrollableContainer]);

    return { fetchMoreOnBottomReached, pageRef, rowVirtualizerInstanceRef, tableContainerRef };
}

export default useTableScroll;
