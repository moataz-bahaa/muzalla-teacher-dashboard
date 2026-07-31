import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useModalAction } from '@/components/modal-views/context'
import type { ICourse } from '@/types/course'
import { routes } from '@/routes/routes'
import { cn } from '@/lib/utils'

interface ICourseCardProps {
  course: ICourse
  className?: string
  compact?: boolean
}

export const CourseCard: React.FC<ICourseCardProps> = ({
  course,
  className,
  compact = false,
}) => {
  const { t } = useTranslation()
  const { openModal } = useModalAction()

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white',
        className,
      )}
    >
      <div className={cn('overflow-hidden bg-neutral-300', compact ? 'h-28' : 'h-36')}>
        <img
          src={course.coverUrl}
          alt={course.title}
          className="size-full object-cover"
        />
      </div>
      <div className={cn('flex flex-col gap-3 p-4', compact && 'gap-2 p-3')}>
        <div className="flex flex-col gap-1.5 text-end">
          <h3
            className={cn(
              'font-heading font-bold text-neutral-900',
              compact ? 'text-base' : 'text-xl',
            )}
          >
            {course.title}
          </h3>
          <p className={cn('line-clamp-2 text-neutral-700', compact ? 'text-xs' : 'text-sm')}>
            {course.description}
          </p>
          <div className="flex flex-wrap justify-end gap-1 pt-1">
            {course.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-success-100 px-2 py-0.5 text-xs font-medium text-success-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between gap-3">
          <p className={cn('font-bold text-purple-heart-700', compact ? 'text-base' : 'text-xl')}>
            {course.price} {course.currency}
          </p>
          <p className="text-xs text-neutral-600 sm:text-sm">
            {t('courses.publishedAt')}: {course.publishedAt}
          </p>
        </div>

        {!compact && (
          <div className="flex gap-3 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="outline"
              className="h-9 flex-1 rounded-lg border-neutral-200 text-neutral-500"
              onClick={() => openModal('DELETE_COURSE', { course })}
            >
              {t('courses.actions.delete')}
            </Button>
            <Button
              asChild
              className="h-9 flex-[1.6] rounded-lg bg-purple-heart-900 hover:bg-purple-heart-800"
            >
              <Link to={routes.courseNew}>{t('courses.actions.view')}</Link>
            </Button>
          </div>
        )}
      </div>
    </article>
  )
}
