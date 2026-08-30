import {
  useModalAction,
  useModalState,
} from '@/components/modal-views/context';
import { CloseButton } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import type { ICourse, TCourseLessonType } from '@/types/course';
import { CircleCheck, FileText, HelpCircle, PlayCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface ICourseViewModalData {
  course: ICourse;
  initialTab?: 'details' | 'curriculum';
}

const LESSON_ICONS: Record<
  TCourseLessonType,
  React.FC<{ className?: string }>
> = {
  video: PlayCircle,
  quiz: HelpCircle,
  article: FileText,
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
  const outcomes = course.outcomes ?? [];
  const lessons = course.lessons ?? [];

  return (
    <div className='relative flex max-h-[90vh] max-w-full w-336 flex-col overflow-hidden rounded-2xl bg-white'>
      <div className='relative h-67.5 shrink-0 overflow-hidden'>
        <img
          src={course.coverUrl}
          alt={course.title}
          className='size-full object-cover'
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/60 to-transparent' />
        <CloseButton
          className='absolute top-10 bg-white/90 rtl:left-10 ltr:right-10'
          onClick={closeModal}
        />
        <div className='absolute inset-x-0 bottom-0 px-8 pb-6'>
          <h2 className='font-heading text-2xl font-bold text-white'>
            {course.title}
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
          <div className='flex flex-col gap-8'>
            <div>
              <h3 className='mb-3 text-xl font-medium text-gray-900'>
                {t('courses.view.description')}
              </h3>
              <p className='text-lg leading-relaxed font-medium text-neutral-500'>
                {course.description}
              </p>
            </div>

            {outcomes.length > 0 && (
              <div>
                <h3 className='mb-4 text-xl font-medium text-neutral-900'>
                  {t('courses.view.outcomes')}
                </h3>
                <ul className='flex flex-col gap-3'>
                  {outcomes.map((outcome) => (
                    <li
                      key={outcome}
                      className='flex items-center gap-3 text-lg text-neutral-700'
                    >
                      <CircleCheck className='size-7 shrink-0 text-neutral-400' />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          // TODO implement the accordion
          <div className='flex flex-col gap-3'>
            {lessons.length === 0 ? (
              <p className='text-center text-sm text-neutral-500'>
                {t('courses.create.curriculumEmpty')}
              </p>
            ) : (
              lessons.map((lesson, index) => {
                const Icon = LESSON_ICONS[lesson.type];
                return (
                  <div
                    key={lesson.id}
                    className='flex items-center gap-4 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3'
                  >
                    <span className='flex size-8 shrink-0 items-center justify-center rounded-full bg-purple-heart-100 text-sm font-medium text-purple-heart-800'>
                      {index + 1}
                    </span>
                    <Icon className='size-5 shrink-0 text-purple-heart-700' />
                    <span className='flex-1 text-sm font-medium text-neutral-800'>
                      {lesson.title}
                    </span>
                    {lesson.duration && (
                      <span className='text-sm text-neutral-500'>
                        {lesson.duration}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
