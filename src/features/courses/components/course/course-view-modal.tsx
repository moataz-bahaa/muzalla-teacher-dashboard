import {
  useModalAction,
  useModalState,
} from '@/components/modal-views/context';
import { CloseButton } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { routes } from '@/routes/routes';
import type { ICourse } from '@/types/course';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export interface ICourseViewModalData {
  course: ICourse;
  initialTab?: 'details' | 'curriculum';
}

const statusLabelKey = (status: string | number) => {
  const value = String(status).toLowerCase();
  if (value === '1' || value === 'published') return 'courses.status.published';
  if (value === '2' || value === 'draft') return 'courses.status.draft';
  if (value === '3' || value === 'pending') return 'courses.status.pending';
  if (value === '4' || value === 'upcoming') return 'courses.status.upcoming';
  return 'courses.status.draft';
};

export const CourseViewModal: React.FC = () => {
  const { t } = useTranslation();
  const { closeModal } = useModalAction();
  const { data } = useModalState<ICourseViewModalData>();

  const [tab, setTab] = useState<'details' | 'curriculum'>(
    data?.initialTab ?? 'details',
  );

  if (!data?.course) {
    throw Error('No course data found');
  }

  const { course } = data;

  return (
    <div className='relative flex max-h-[90vh] max-w-full w-336 flex-col overflow-hidden rounded-2xl bg-white'>
      <div className='relative h-67.5 shrink-0 overflow-hidden'>
        <img
          src={course.coverUrl}
          alt={course.name}
          className='size-full object-cover'
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/60 to-transparent' />
        <CloseButton
          className='absolute top-10 bg-white/90 rtl:left-10 ltr:right-10'
          onClick={closeModal}
        />
        <div className='absolute inset-x-0 bottom-0 px-8 pb-6'>
          <h2 className='font-heading text-2xl font-bold text-white'>
            {course.name}
          </h2>
        </div>
      </div>

      <Tabs
        currentActive={tab}
        onChange={(value) => setTab(value as 'details' | 'curriculum')}
        items={[
          { value: 'details', label: t('courses.view.detailsTab') },
          { value: 'curriculum', label: t('courses.view.curriculumTab') },
        ]}
      />

      <div className='flex-1 overflow-y-auto px-8 py-6'>
        {tab === 'details' ? (
          <div className='flex flex-col gap-6'>
            <div>
              <h3 className='mb-3 text-xl font-medium text-gray-900'>
                {t('courses.view.description')}
              </h3>
              <p className='text-lg leading-relaxed font-medium text-neutral-500'>
                {course.description || '—'}
              </p>
            </div>

            <div className='grid gap-3 text-sm text-neutral-700 sm:grid-cols-2'>
              <p>
                <span className='font-medium'>
                  {t('courses.columns.status')}:{' '}
                </span>
                {t(statusLabelKey(course.status))}
              </p>
              <p>
                <span className='font-medium'>
                  {t('courses.columns.level')}:{' '}
                </span>
                {course.levelName || '—'}
              </p>
              <p>
                <span className='font-medium'>
                  {t('courses.create.duration')}:{' '}
                </span>
                {course.durationInMinutes} {t('courses.create.minutes')}
              </p>
              <p>
                <span className='font-medium'>
                  {t('courses.create.hasCertificate')}:{' '}
                </span>
                {course.hasCertificate ? t('common.yes') : t('common.no')}
              </p>
            </div>

            {course.tags.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {course.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className='rounded-full bg-success-100 px-2 py-0.5 text-xs font-medium text-success-800'
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className='flex flex-col items-center gap-4 py-8 text-center'>
            <p className='text-sm text-neutral-500'>
              {t('courses.create.curriculumEmpty')}
            </p>
            <Link
              to={routes.courseBuilder(course.id)}
              className='text-sm font-medium text-purple-heart-800 hover:underline'
              onClick={closeModal}
            >
              {t('courses.actions.openBuilder')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
