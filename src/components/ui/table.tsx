import { cn } from '@/lib/utils';
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

const lastCellClassName =
  'sticky z-5 shadow-[-4px_0_8px_rgba(0,0,0,0.04)] ltr:right-0 rtl:left-0 ltr:border-s rtl:border-e border-neutral-200';

interface ITableProps<T extends object> {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  isPending?: boolean;
  centerContent?: boolean;
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  skeletonRowsLength?: number;
  syncOrderingToUrl?: boolean;
}

const Table = <T extends object>({
  columns,
  data,
  isPending,
  centerContent,
  className,
  headerClassName,
  cellClassName,
  skeletonRowsLength = 20,
  syncOrderingToUrl = true,
}: ITableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const handleSortingChange = (
    updater: SortingState | ((old: SortingState) => SortingState),
  ) => {
    const newSorting =
      typeof updater === 'function' ? updater(sorting) : updater;
    setSorting(newSorting);

    if (!syncOrderingToUrl) return;

    if (newSorting.length > 0) {
      const { id, desc } = newSorting[0];
      const orderingValue = desc ? `-${id}` : id;
      searchParams.set('ordering', orderingValue);
    } else {
      searchParams.delete('ordering');
    }

    setSearchParams(searchParams);
  };

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: handleSortingChange,
    state: { sorting },
    defaultColumn: {
      size: 120,
    },
  });

  const skeletonRows = Array(skeletonRowsLength).fill(null);

  return (
    <div
      className={cn(
        'relative w-full scrollbar-hide grow overflow-x-auto',
        className,
      )}
    >
      <table className='w-full min-w-max table-fixed stroke-neutral-400 text-start'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className='border-b border-neutral-200'>
              {headerGroup.headers.map((header, index) => {
                const canSort = header.column.getCanSort();
                return (
                  <th
                    key={header.id}
                    onClick={
                      canSort
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    className={cn(
                      'z-0 p-3 text-sm font-normal text-neutral-600 bg-muted!',
                      canSort && 'cursor-pointer',
                      {
                        [lastCellClassName]:
                          index === headerGroup.headers.length - 1,
                        'bg-neutral-100':
                          index === headerGroup.headers.length - 1,
                      },
                      headerClassName,
                    )}
                    style={{ width: header.getSize() }}
                  >
                    <div
                      className={cn('flex items-center gap-2', {
                        'justify-center': centerContent,
                      })}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {header.column.getIsSorted() && (
                        <ChevronsUpDown className='size-4 stroke-neutral-400' />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {isPending ? (
            skeletonRows.map((_, index) => (
              <tr key={index} className='border-b border-neutral-200'>
                {columns.map((_, colIndex) => (
                  <td
                    key={colIndex}
                    className={cn('p-3', { 'text-center': centerContent })}
                  >
                    <div className='h-4 w-full animate-pulse rounded bg-neutral-300' />
                  </td>
                ))}
              </tr>
            ))
          ) : table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className='border-b border-neutral-200 hover:bg-neutral-50'
              >
                {row.getVisibleCells().map((cell, cellIndex) => (
                  <td
                    key={cell.id}
                    className={cn(
                      'z-0 p-3 text-xs font-medium text-ellipsis overflow-hidden text-neutral-500',
                      {
                        [lastCellClassName]:
                          cellIndex === row.getVisibleCells().length - 1,
                        'text-center': centerContent,
                      },
                      cellClassName,
                    )}
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className='p-3 text-center text-sm text-neutral-600'
              >
                {t('common.noData')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
