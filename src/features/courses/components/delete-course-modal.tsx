import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useModalAction, useModalState } from '@/components/modal-views/context'
import type { IDeleteCourseModalData } from '@/types/course'

export const DeleteCourseModal: React.FC = () => {
  const { t } = useTranslation()
  const { closeModal } = useModalAction()
  const { data } = useModalState<IDeleteCourseModalData>()

  const onConfirm = () => {
    toast.success(t('courses.toast.deleted', { title: data?.course.title ?? '' }))
    closeModal()
  }

  return (
    <div className="flex flex-col gap-4 text-start">
      <h2 className="font-heading text-xl font-bold text-neutral-900">
        {t('courses.delete.title')}
      </h2>
      <p className="text-sm text-neutral-500">
        {t('courses.delete.description', { title: data?.course.title ?? '' })}
      </p>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={closeModal}>
          {t('common.cancel')}
        </Button>
        <Button
          className="bg-danger-600 text-white hover:bg-danger-700"
          onClick={onConfirm}
        >
          {t('courses.delete.confirm')}
        </Button>
      </div>
    </div>
  )
}
