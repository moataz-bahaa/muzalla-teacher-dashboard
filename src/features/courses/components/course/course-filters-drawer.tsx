import {
  useDrawerAction,
  useDrawerState,
} from '@/components/drawer-views/context';
import DrawerContent from '@/components/drawer-views/drawer-content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { ICourseFilters } from '@/types/course';
import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const DEFAULT_FILTERS: ICourseFilters = {
  keywords: '',
  tags: ['كيمياء', 'الحديد', 'أكسيد الحديد'],
  priceFrom: 250,
  priceTo: 750,
};

export const CourseFiltersDrawer: React.FC = () => {
  const { t } = useTranslation();
  const { closeDrawer } = useDrawerAction();
  const { data } = useDrawerState<{
    filters?: ICourseFilters;
    onApply?: (filters: ICourseFilters) => void;
  }>();

  const [filters, setFilters] = useState<ICourseFilters>(
    data?.filters ?? DEFAULT_FILTERS,
  );

  const removeTag = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.filter((item) => item !== tag),
    }));
  };

  const clearAll = () => {
    setFilters({
      keywords: '',
      tags: [],
      priceFrom: 0,
      priceTo: 1000,
    });
  };

  const apply = () => {
    data?.onApply?.(filters);
    closeDrawer();
  };

  return (
    <DrawerContent title={t('courses.filters.title')}>
      <div className='flex flex-col gap-8'>
        <div className='flex flex-col gap-3'>
          <div className='relative'>
            <Search className='pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500' />
            <Input
              value={filters.keywords}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  keywords: event.target.value,
                }))
              }
              placeholder={t('courses.filters.keywordsPlaceholder')}
              className='h-11 rounded-lg ps-10'
            />
          </div>
          <div className='flex flex-wrap gap-1'>
            {filters.tags.map((tag) => (
              <button
                key={tag}
                type='button'
                onClick={() => removeTag(tag)}
                className='inline-flex items-center gap-1 rounded-full bg-success-100 px-2 py-0.5 text-xs font-medium text-success-800'
              >
                <X className='size-3' />
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* TODO use 1 progress with 2 controlls as in UI (low priority) */}
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between gap-3'>
            <p className='text-sm font-medium'>{t('courses.filters.price')}</p>
            <div className='flex items-center gap-2'>
              <span className='text-sm'>{t('courses.filters.from')}</span>
              <Input
                type='number'
                value={filters.priceFrom}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    priceFrom: Number(event.target.value) || 0,
                  }))
                }
                className='h-7 w-14 rounded-md px-1 text-center text-sm'
              />
              <span className='text-sm'>{t('courses.filters.to')}</span>
              <Input
                type='number'
                value={filters.priceTo}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    priceTo: Number(event.target.value) || 0,
                  }))
                }
                className='h-7 w-14 rounded-md px-1 text-center text-sm'
              />
            </div>
          </div>

          <div className='px-1'>
            <input
              type='range'
              min={0}
              max={1000}
              value={filters.priceFrom}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  priceFrom: Math.min(Number(event.target.value), prev.priceTo),
                }))
              }
              className='w-full accent-purple-heart-700'
            />
            <input
              type='range'
              min={0}
              max={1000}
              value={filters.priceTo}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  priceTo: Math.max(Number(event.target.value), prev.priceFrom),
                }))
              }
              className={cn('mt-2 w-full accent-purple-heart-700')}
            />
            <div className='mt-2 flex justify-between text-sm font-medium text-purple-heart-950'>
              <span>{filters.priceFrom}</span>
              <span>{filters.priceTo}</span>
            </div>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-center gap-6'>
        <Button
          className='h-10 w-30 rounded-lg bg-purple-heart-900 hover:bg-purple-heart-800'
          onClick={apply}
        >
          {t('courses.filters.apply')}
        </Button>
        <Button
          variant='outline'
          className='h-10 flex-1 rounded-lg border-neutral-200 text-neutral-500'
          onClick={clearAll}
        >
          {t('courses.filters.clear')}
        </Button>
      </div>
    </DrawerContent>
  );
};
