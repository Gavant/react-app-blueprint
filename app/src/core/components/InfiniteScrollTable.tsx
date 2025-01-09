import { TableContainer } from '@mui/material';
import {
    MRT_ColumnDef,
    MRT_RowData,
    MRT_Table,
    MRT_TableBody,
    MRT_TableHead,
    MRT_TableOptions,
    MRT_ToolbarAlertBanner,
    MRT_TopToolbar,
} from 'material-react-table';
import { MutableRefObject } from 'react';

import { BaseQuery, useInfiniteMaterialReactTable } from '~/core/hooks/useInfiniteMaterialReactTable';
import { Page } from '~/core/types/generated/graphql';

interface InfiniteScrollTableProps<Q extends BaseQuery<R>, R extends MRT_RowData> {
    columns: MRT_ColumnDef<R, unknown>[];
    data?: Q;
    fetchMore: () => void;
    gqlKey: keyof Q;
    loading: boolean;
    pageRef: MutableRefObject<Page>;
    tableOptions?: Partial<MRT_TableOptions<R>>;
}
// TODO: Make Generic Table
const InfiniteScrollTable = <Q extends BaseQuery<R>, R extends MRT_RowData>({
    columns,
    data,
    fetchMore,
    gqlKey,
    loading,
    pageRef,
}: InfiniteScrollTableProps<Q, R>) => {
    const { table } = useInfiniteMaterialReactTable<Q, R>({
        columns,
        data,
        fetchMore,
        key: gqlKey,
        loading,
        pageRef,
    });

    return (
        <TableContainer sx={{ overflowX: 'initial' }}>
            <MRT_TopToolbar table={table} />
            <MRT_Table aria-label="sticky table" stickyHeader table={table}>
                <MRT_TableHead table={table} />
                <MRT_TableBody table={table} />
            </MRT_Table>
            <MRT_ToolbarAlertBanner stackAlertBanner table={table} />
        </TableContainer>
    );
};

export default InfiniteScrollTable;
