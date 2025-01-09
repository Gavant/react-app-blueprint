import { Virtualizer } from '@tanstack/react-virtual';
import { MutableRefObject, useCallback, useEffect, useRef } from 'react';

import { Page } from '~/core/types/generated/graphql';

interface QueryOnScroll {
    currentRowCount: number;
    fetchHeight?: number;
    fetchMore: () => void;
    loading: boolean;
    pageRef: MutableRefObject<Page>;
    scrollableContainer?: Element | null;
    totalRowCount: number;
}

function useTableScroll<P extends Page>({
    currentRowCount,
    fetchHeight = 50,
    fetchMore,
    loading,
    pageRef,
    scrollableContainer,
    totalRowCount,
}: QueryOnScroll) {
    const tableContainerRef = useRef<HTMLDivElement | null>(null);
    const rowVirtualizerInstanceRef = useRef<Virtualizer<HTMLDivElement, HTMLTableRowElement> | null>(null);
    const scrollContainer = scrollableContainer ?? tableContainerRef.current;

    //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
    const fetchMoreOnBottomReached = useCallback(async () => {
        if (scrollContainer) {
            const { clientHeight, scrollHeight, scrollTop } = scrollContainer;
            //once the user has scrolled within (fetchHeight)px of the bottom of the table, fetch more data if we can
            if (scrollHeight - scrollTop - clientHeight < fetchHeight && !loading && currentRowCount < totalRowCount) {
                pageRef.current.offset = currentRowCount;
                await fetchMore();
            }
        }
    }, [scrollContainer, fetchHeight, loading, currentRowCount, totalRowCount, pageRef, fetchMore]);

    useEffect(() => {
        try {
            pageRef.current = { limit: pageRef?.current?.limit ?? 10, offset: 0 } as P;
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchMoreOnBottomReached();
    }, [fetchMoreOnBottomReached]);

    useEffect(() => {
        const onScroll = () => {
            fetchMoreOnBottomReached();
        };
        scrollContainer?.addEventListener('scroll', onScroll);

        return () => scrollContainer?.removeEventListener('scroll', onScroll);
    }, [fetchMoreOnBottomReached, scrollContainer, scrollableContainer]);

    return { fetchMoreOnBottomReached, pageRef, rowVirtualizerInstanceRef, tableContainerRef };
}

export default useTableScroll;
