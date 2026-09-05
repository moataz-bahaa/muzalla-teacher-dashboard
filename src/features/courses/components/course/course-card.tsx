import { useModalAction } from '@/components/modal-views/context';
import { Button } from '@/components/ui/button';
import { API_ENDPOINTS } from '@/lib/data/client/endpoints';
import { cn } from '@/lib/utils';
import { routes } from '@/routes/routes';
import type { ICourseResponse, ITagResponse } from '@/types/course';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { IDeleteModalData } from '../../../../components/modal-views/delete-modal';

export interface ICourseCardPreview {
  id: number;
  name: string;
  description: string | null;
  coverUrl: string;
  tags: Array<ITagResponse | string>;
  levelName?: string | null;
}

interface ICourseCardProps {
  course: ICourseResponse | ICourseCardPreview;
  className?: string;
  compact?: boolean;
}

const tagLabel = (tag: ITagResponse | string) =>
  typeof tag === 'string' ? tag : tag.name;

const tagKey = (tag: ITagResponse | string, index: number) =>
  typeof tag === 'string' ? `${tag}-${index}` : tag.id;

export const CourseCard: React.FC<ICourseCardProps> = ({
  course,
  className,
  compact = false,
}) => {
  const { t } = useTranslation();
  const { openModal } = useModalAction();

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white',
        className,
      )}
    >
      <div
        className={cn(
          'overflow-hidden bg-neutral-300',
          compact ? 'h-28' : 'h-36',
        )}
      >
        <img
          src={course.coverUrl}
          alt={course.name}
          className='size-full object-cover'
        />
      </div>
      <div className={cn('flex flex-col gap-3 p-4', compact && 'gap-2 p-3')}>
        <div className='flex flex-col gap-1.5'>
          <h3
            className={cn(
              'font-heading font-bold text-neutral-900',
              compact ? 'text-base' : 'text-xl',
            )}
          >
            {course.name}
          </h3>
          <p
            className={cn(
              'line-clamp-2 text-neutral-700',
              compact ? 'text-xs' : 'text-sm',
            )}
          >
            {course.description || '—'}
          </p>
          <div className='flex flex-wrap gap-1 pt-1'>
            {course.tags.map((tag, index) => (
              <span
                key={tagKey(tag, index)}
                className='rounded-full bg-success-100 px-2 py-0.5 text-xs font-medium text-success-800'
              >
                {tagLabel(tag)}
              </span>
            ))}
          </div>
        </div>

        {'levelName' in course && course.levelName ? (
          <p className='text-xs text-neutral-700'>
            <span className='font-medium'>{t('courses.columns.level')}: </span>
            {course.levelName}
          </p>
        ) : null}

        {!compact && course.id > 0 && (
          <div className='flex gap-3'>
            <Button
              variant='outline'
              className='h-9 flex-1 rounded-lg border-neutral-200 text-neutral-500'
              onClick={() =>
                openModal('DELETE_OBJECT', {
                  object: 'course',
                  id: course.id,
                  title: course.name,
                  invalidateQueryFilter: {
                    queryKey: [API_ENDPOINTS.courses],
                  },
                } as IDeleteModalData)
              }
            >
              {t('courses.actions.delete')}
            </Button>
            <Button
              asChild
              className='h-9 flex-[1.6] rounded-lg bg-purple-heart-900 hover:bg-purple-heart-800'
            >
              <Link to={routes.courseBuilder(course.id)}>
                {t('courses.actions.view')}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </article>
  );
};
