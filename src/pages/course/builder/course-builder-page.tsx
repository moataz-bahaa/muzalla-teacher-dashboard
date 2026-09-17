import DraftIcon from '@/components/icons/draft-icon';
import { PageBreadcrumb } from '@/components/page-breadcrumb';
import { Button } from '@/components/ui/button';
import { BuilderCanvas } from '@/features/course-builder/components/builder-canvas';
import { BuilderEmptyState } from '@/features/course-builder/components/builder-empty-state';
import { BuilderOnboarding } from '@/features/course-builder/components/builder-onboarding';
import { CurriculumSidebar } from '@/features/course-builder/components/curriculum-sidebar';
import {
  BuilderProvider,
  useBuilder,
} from '@/features/course-builder/context/builder-context';
import {
  useCourseQuery,
  useUpdateCourseMutation,
} from '@/lib/data/course-builder';
import { routes } from '@/routes/routes';
import { ECourseStatus } from '@/types/page-block';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const BuilderProgress: React.FC<{ value: number }> = ({ value }) => {
  return (
    <div className='relative h-2 w-full overflow-hidden bg-neutral-200/75'>
      <div
        className='absolute inset-y-0 start-0 bg-purple-heart-700/75 transition-all'
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};

const BuilderHeaderBreadcrumb: React.FC<{
  courseName?: string;
}> = ({ courseName }) => {
  const { t } = useTranslation();
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setSlot(document.getElementById('dashboard-breadcrumb'));
  }, []);

  if (!slot) return null;

  return createPortal(
    <PageBreadcrumb
      items={[
        { label: t('dashboard.home'), to: routes.home },
        { label: t('courses.title'), to: routes.courses },
        { label: courseName ?? t('courses.create.breadcrumb') },
      ]}
    />,
    slot,
  );
};

const BuilderContent: React.FC = () => {
  const { t } = useTranslation();
  const { courseId, sections, selectedPageId, onboardingDismissed, getPages } =
    useBuilder();
  const { data: course } = useCourseQuery(courseId);
  const updateCourse = useUpdateCourseMutation();

  const hasSections = sections.length > 0;
  const firstSectionId = sections[0]?.id;
  const hasPages =
    firstSectionId !== undefined && getPages(firstSectionId).length > 0;
  const showOnboarding = hasSections && !hasPages && !onboardingDismissed;
  const showCanvas = Boolean(selectedPageId);

  const progress =
    sections.length === 0 ? 40 : selectedPageId && hasPages ? 70 : 55;

  const saveCourse = (status: ECourseStatus) => {
    updateCourse.mutate(
      { id: courseId, status },
      {
        onSuccess: () => {
          toast.success(
            status === ECourseStatus.Draft
              ? t('courses.toast.draftSaved')
              : t('courses.toast.saved'),
          );
        },
      },
    );
  };

  return (
    <div className='-mx-6 -mt-6 flex flex-col gap-6 lg:-mx-10'>
      <BuilderHeaderBreadcrumb courseName={course?.name} />
      <BuilderProgress value={progress} />

      <div className='flex flex-wrap items-center gap-3 px-6 lg:px-10'>
        <h1 className='font-heading text-3xl font-bold text-purple-heart-950 sm:text-4xl'>
          {t('courses.title')}
        </h1>
        <div className='grow' />
        <Button
          className='h-12 min-w-[230px] gap-2 rounded-lg bg-purple-heart-900 px-8 text-base hover:bg-purple-heart-800 disabled:border-neutral-400 disabled:bg-neutral-400 disabled:text-white disabled:opacity-100'
          disabled={!hasSections || updateCourse.isPending}
          onClick={() => saveCourse(ECourseStatus.Published)}
        >
          {t('courses.create.saveContinue')}
          <ChevronRight className='size-6 rtl:rotate-180' />
        </Button>
        <Button
          variant='outline'
          className='h-12 min-w-[230px] gap-2 rounded-lg border-neutral-200 bg-white px-8 text-base text-neutral-800'
          disabled={updateCourse.isPending}
          onClick={() => saveCourse(ECourseStatus.Draft)}
        >
          <DraftIcon className='size-6' />
          {t('courses.create.saveDraft')}
        </Button>
      </div>

      <div className='grid grid-cols-1 gap-6 px-6 pb-6 lg:grid-cols-[minmax(0,1fr)_359px] lg:px-10'>
        <div className='min-h-[640px]'>
          {!hasSections && <BuilderEmptyState />}
          {showOnboarding && <BuilderOnboarding />}
          {showCanvas && <BuilderCanvas />}
          {hasSections && hasPages && !showCanvas && !showOnboarding && (
            <div className='flex min-h-120 items-center justify-center p-8 text-center text-neutral-500'>
              {t('courses.builder.selectPage')}
            </div>
          )}
        </div>

        <CurriculumSidebar />
      </div>
    </div>
  );
};

const CourseBuilderPage: React.FC = () => {
  const { courseId: courseIdParam } = useParams<{ courseId: string }>();
  const courseId = Number(courseIdParam) || 1;

  return (
    <BuilderProvider courseId={courseId}>
      <BuilderContent />
    </BuilderProvider>
  );
};

export default CourseBuilderPage;
