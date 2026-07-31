import { useDrawerAction } from '@/components/drawer-views/context';
import { PageBreadcrumb } from '@/components/page-breadcrumb';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/features/courses/components/course/course-card';
import { MOCK_COURSES } from '@/features/courses/data/mock-courses';
import { cn } from '@/lib/utils';
import { routes } from '@/routes/routes';
import type { ICourseFilters, TCourseStatus } from '@/types/course';
import { ListFilterPlus, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const CoursesPage: React.FC = () => {
  const { t } = useTranslation();
  const { openDrawer } = useDrawerAction();
  const [tab, setTab] = useState<TCourseStatus>('published');
  const [filters, setFilters] = useState<ICourseFilters>({
    keywords: '',
    tags: [],
    priceFrom: 0,
    priceTo: 10000,
  });

  const filteredCourses = useMemo(() => {
    return MOCK_COURSES.filter((course) => {
      if (course.status !== tab) return false;
      if (filters.keywords) {
        const q = filters.keywords.toLowerCase();
        const haystack =
          `${course.title} ${course.description} ${course.tags.join(' ')}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (
        filters.tags.length > 0 &&
        !filters.tags.some((tag) => course.tags.includes(tag))
      ) {
        return false;
      }
      if (course.price < filters.priceFrom || course.price > filters.priceTo) {
        return false;
      }
      return true;
    });
  }, [filters, tab]);

  const publishedCount = MOCK_COURSES.filter(
    (course) => course.status === 'published',
  ).length;

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-3'>
        <div className='flex items-center gap-4'>
          <h1 className='font-heading text-4xl font-bold text-purple-heart-950 sm:text-4xl'>
            {t('courses.title')}
          </h1>
          <div className='grow'></div>
          <Button
            variant='outline'
            className='h-12 gap-2 rounded-lg border-neutral-200 bg-white px-6 text-neutral-700'
            onClick={() =>
              openDrawer('COURSE_FILTERS', {
                filters,
                onApply: setFilters,
              })
            }
          >
            {t('courses.filter')}
            <ListFilterPlus className='size-[0.88481rem]' />
          </Button>
          <Button
            asChild
            className='h-12 gap-2 rounded-lg bg-purple-heart-900 px-14 hover:bg-purple-heart-800'
          >
            <Link to={routes.courseNew}>
              {t('courses.add')}
              <Plus className='size-4' />
            </Link>
          </Button>
        </div>
        <PageBreadcrumb
          items={[
            { label: t('dashboard.home'), to: routes.home },
            { label: t('courses.title') },
          ]}
        />
      </div>

      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center justify-end gap-6 border-b border-neutral-200'>
          <button
            type='button'
            onClick={() => setTab('inactive')}
            className={cn(
              'pb-3 text-sm font-medium text-neutral-500',
              tab === 'inactive' &&
                'border-b-2 border-purple-heart-700 text-purple-heart-800',
            )}
          >
            {t('courses.tabs.inactive')}
          </button>
          <button
            type='button'
            onClick={() => setTab('published')}
            className={cn(
              'flex items-center gap-2 pb-3 text-sm font-medium text-neutral-500',
              tab === 'published' &&
                'border-b-2 border-purple-heart-700 text-purple-heart-800',
            )}
          >
            <span className='rounded-full bg-purple-heart-100 px-1.5 text-xs text-purple-heart-800'>
              {publishedCount}
            </span>
            {t('courses.tabs.published')}
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};
