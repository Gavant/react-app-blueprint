import { MRT_ColumnDef, MRT_RowData, MRT_TableOptions, useMaterialReactTable } from 'material-react-table';
import { MutableRefObject } from 'react';

import { getDefaultMRTOptions } from '~/core/constants/table';
import useTableScroll from '~/core/hooks/useTableScroll';
import { Exact, Page } from '~/core/types/generated/graphql';

export type BaseQuery<R extends MRT_RowData> = {
    [key: string]:
        | {
              items: R[];
              meta: {
                  totalCount: number;
              };
          }
        | string;
} & Exact<{ __typename?: 'Query' }>;

interface UseInfiniteMaterialReactTableProps<Q extends BaseQuery<R>, R extends MRT_RowData> {
    columns: MRT_ColumnDef<R, unknown>[];
    data?: Q;
    fetchMore: () => void;
    key: keyof Q;
    loading: boolean;
    pageRef: MutableRefObject<Page>;
    scrollableContainer?: string;
    tableOptions?: Partial<MRT_TableOptions<R>>;
}

export function useInfiniteMaterialReactTable<Q extends BaseQuery<R>, R extends MRT_RowData>({
    columns,
    data,
    fetchMore,
    key,
    loading,
    pageRef,
    scrollableContainer = 'body',
    tableOptions,
}: UseInfiniteMaterialReactTableProps<Q, R>) {
    const keyedItem = data?.[key];
    const { fetchMoreOnBottomReached, tableContainerRef } = useTableScroll({
        currentRowCount: typeof keyedItem === 'string' ? 0 : keyedItem?.items?.length ?? 0,
        fetchMore,
        loading,
        pageRef,
        scrollableContainer,
        totalRowCount: typeof keyedItem === 'string' ? 0 : keyedItem?.meta?.totalCount ?? 0,
    });

    const table = useMaterialReactTable<R>({
        columns,
        data: typeof keyedItem === 'string' ? [] : keyedItem?.items ?? [],
        muiTableContainerProps: {
            onScroll: () => fetchMoreOnBottomReached(),
            ref: tableContainerRef,
            ...tableOptions?.muiTableContainerProps,
        },
        ...getDefaultMRTOptions<R>(),
        ...tableOptions,
        state: {
            isLoading: !keyedItem && loading,
            showProgressBars: loading,
            ...tableOptions?.state,
        },
    });
    return { table };
}
