import {
  useDrawerAction,
  useDrawerState,
} from '@/components/drawer-views/context';
import DrawerContent from '@/components/drawer-views/drawer-content';
import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/ui/form/select-field';
import { ACADEMIC_YEARS } from '@/features/students/data/mock-students';
import type { IGetStudentsParams } from '@/types/student';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const DEFAULT_FILTERS: IGetStudentsParams = {
  status: 'all',
  academicYear: 'all',
};

export const StudentFiltersDrawer: React.FC = () => {
  const { t } = useTranslation();
  const { closeDrawer } = useDrawerAction();
  const { data } = useDrawerState<{
    filters?: IGetStudentsParams;
    onApply?: (filters: IGetStudentsParams) => void;
  }>();
  const [filters, setFilters] = useState<IGetStudentsParams>(
    data?.filters ?? DEFAULT_FILTERS,
  );

  const clearAll = () => setFilters(DEFAULT_FILTERS);

  const apply = () => {
    data?.onApply?.(filters);
    closeDrawer();
  };

  return (
    <DrawerContent className='w-112.5' title={t('students.filters.title')}>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-medium text-neutral-700'>
            {t('students.filters.status')}
          </label>
          <SelectField
            label={t('students.filters.status')}
            options={[
              { label: t('students.status.all'), value: 'all' },
              { label: t('students.status.active'), value: 'active' },
              { label: t('students.status.inactive'), value: 'inactive' },
            ]}
            value={filters.status ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                status: value as IGetStudentsParams['status'],
              }))
            }
          />
          <SelectField
            label={t('students.filters.academicYear')}
            options={ACADEMIC_YEARS.map((year) => ({
              label: t(`students.academicYears.${year}`),
              value: year,
            }))}
            value={filters.academicYear ?? ''}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                academicYear: value as IGetStudentsParams['academicYear'],
              }))
            }
          />
        </div>
      </div>

      <div className='btn-group'>
        <Button
          variant='purple'
          size='lg'
          className='px-10'
          onClick={apply}
        >
          {t('students.filters.apply')}
        </Button>
        <Button
          variant='outline'
          size='lg'
          className='flex-1/2'
          onClick={clearAll}
        >
          {t('students.filters.clear')}
        </Button>
      </div>
    </DrawerContent>
  );
};
