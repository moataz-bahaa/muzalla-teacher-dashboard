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
import { cn } from '@/lib/utils';
import { routes } from '@/routes/routes';
import { ECourseStatus } from '@/types/page-block';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const BuilderProgress: React.FC = () => {
  const { sections, selectedPageId, getPages } = useBuilder();
  const totalPages = sections.reduce(
    (acc, section) => acc + getPages(section.id).length,
    0,
  );
  const progress =
    sections.length === 0 ? 0 : selectedPageId && totalPages > 0 ? 45 : 25;

  return (
    <div className='relative h-2 overflow-hidden rounded-full bg-purple-heart-100'>
      <div
        className='absolute inset-y-0 start-0 rounded-full bg-purple-heart-700 transition-all'
        style={{ width: `${progress}%` }}
      />
    </div>
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
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-wrap items-center gap-3'>
          <h1 className='font-heading text-3xl font-bold text-purple-heart-950 sm:text-4xl'>
            {t('courses.title')}
          </h1>
          <div className='grow' />
          <Button
            className='h-12 gap-2 rounded-lg bg-purple-heart-900 px-8 hover:bg-purple-heart-800'
            disabled={!hasSections || updateCourse.isPending}
            onClick={() => saveCourse(ECourseStatus.Published)}
          >
            <ChevronRight className='size-6' />
            {t('courses.create.saveContinue')}
          </Button>
          <Button
            variant='outline'
            className='h-12 gap-2 rounded-lg border-neutral-200 bg-white px-8 text-neutral-700'
            disabled={updateCourse.isPending}
            onClick={() => saveCourse(ECourseStatus.Draft)}
          >
            {t('courses.create.saveDraft')}
            <DraftIcon className='size-4' />
          </Button>
        </div>

        <PageBreadcrumb
          items={[
            { label: t('dashboard.home'), to: routes.home },
            { label: t('courses.title') },
            {
              label: course?.name ?? t('courses.create.breadcrumb'),
            },
          ]}
        />

        <BuilderProgress />
      </div>

      <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px] relative'>
        <div
          className={cn(
            'rounded-2xl border border-neutral-200 bg-white',
            !hasSections && 'min-h-160',
          )}
        >
          {!hasSections && <BuilderEmptyState />}
          {showOnboarding && (
            <div className='p-5'>
              <BuilderOnboarding />
            </div>
          )}
          {showCanvas && (
            <div className='p-5'>
              <BuilderCanvas />
            </div>
          )}
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
