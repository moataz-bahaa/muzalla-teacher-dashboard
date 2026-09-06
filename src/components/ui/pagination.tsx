import { cn } from '@/lib/utils';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface IPaginationProps {
  current: number;
  totalPages: number | undefined;
  onChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<IPaginationProps> = ({
  current,
  totalPages: totalPagesProp,
  onChange,
  className,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const totalPages = Math.max(1, totalPagesProp ?? 1);
  const currentPage = Math.min(Math.max(1, current), totalPages);

  const goTo = (page: number) => {
    onChange(Math.min(totalPages, Math.max(1, page)));
  };

  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 text-sm font-medium text-neutral-600',
        className,
      )}
    >
      <button
        type='button'
        className='rounded-md p-1 hover:bg-neutral-100 disabled:opacity-40'
        disabled={currentPage <= 1}
        onClick={() => goTo(currentPage - 1)}
        aria-label={t('common.pagination.prev')}
      >
        {isRtl ? (
          <ChevronsRight className='size-4' />
        ) : (
          <ChevronsLeft className='size-4' />
        )}
      </button>

      <div className='flex items-center gap-2'>
        <input
          type='number'
          min={1}
          max={totalPages}
          value={currentPage}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (Number.isFinite(next)) {
              goTo(next);
            }
          }}
          className='h-8 w-12 rounded-md border border-neutral-200 bg-white text-center text-sm'
          aria-label={t('common.pagination.current')}
        />
        <span>{t('common.pagination.of')}</span>
        <span>{totalPages}</span>
      </div>

      <button
        type='button'
        className='rounded-md p-1 hover:bg-neutral-100 disabled:opacity-40'
        disabled={currentPage >= totalPages}
        onClick={() => goTo(currentPage + 1)}
        aria-label={t('common.pagination.next')}
      >
        {isRtl ? (
          <ChevronsLeft className='size-4' />
        ) : (
          <ChevronsRight className='size-4' />
        )}
      </button>
    </div>
  );
};

export default Pagination;
