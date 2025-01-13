import { type MRT_RowData, type MRT_TableInstance, type MRT_TableOptions } from 'material-react-table';

export /**
 * Table Package recommends using default options instead of a base component
 * https://www.material-react-table.com/docs/guides/best-practices#re-usable-default-options
 *
 * @template TData
 * @returns {*}
 */
const getDefaultMRTOptions = <TData extends MRT_RowData>(): Partial<MRT_TableOptions<TData>> => ({
    enableColumnActions: false,
    enableColumnFilters: false,
    enableGlobalFilter: false,
    enableKeyboardShortcuts: false,
    enablePagination: false,
    enableSorting: false,
    enableStickyHeader: true,

    mrtTheme: (theme) => ({
        baseBackgroundColor: theme.palette.background.default, //change default background color
    }),
});

export const debugTable = <TData extends MRT_RowData>(table: MRT_TableInstance<TData>) => {
    return { renderedRows: table.getRowModel().rows, state: table.getState() };
};
