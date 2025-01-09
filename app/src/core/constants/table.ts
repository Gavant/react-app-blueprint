import { type MRT_RowData, type MRT_TableInstance, type MRT_TableOptions } from 'material-react-table';

export /**
 * Table Package recommends using default options instead of a base component
 * https://www.material-react-table.com/docs/guides/best-practices#re-usable-default-options
 *
 * @template TData
 * @returns {*}
 */
const getDefaultMRTOptions = <TData extends MRT_RowData>(): Partial<MRT_TableOptions<TData>> => ({
    enableGlobalFilter: false,
    enableRowPinning: true,
    initialState: { showColumnFilters: true },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiTableHeadCellProps: {
        sx: { fontSize: '1.1rem' },
    },
    paginationDisplayMode: 'pages',
});

export const debugTable = <TData extends MRT_RowData>(table: MRT_TableInstance<TData>) => {
    return { renderedRows: table.getRowModel().rows, state: table.getState() };
};
