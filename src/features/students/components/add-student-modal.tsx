import { useModalAction } from '@/components/modal-views/context';
import { Button, CloseButton } from '@/components/ui/button';
import { StudentForm } from '@/features/students/components/student-form';
import { useAddStudentMutation } from '@/lib/data/students';
import type { ICreateStudentInput } from '@/types/student';
import type { SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const ADD_STUDENT_FORM_ID = 'add-student-form';

export const AddStudentModal: React.FC = () => {
  const { t } = useTranslation();
  const { closeModal } = useModalAction();

  const addMutation = useAddStudentMutation({
    onSuccess: () => {
      closeModal();
    },
  });

  const onSubmit: SubmitHandler<ICreateStudentInput> = (values) => {
    addMutation.mutate(values);
  };

  return (
    <div className='relative max-w-full w-4xl rounded-2xl bg-white p-6 shadow-xl sm:p-8'>
      <CloseButton
        className='absolute top-4 ltr:right-4 rtl:left-4'
        onClick={closeModal}
      />

      <StudentForm
        id={ADD_STUDENT_FORM_ID}
        title={t('students.addModal.title')}
        onSubmit={onSubmit}
      />

      <div className='flex items-center justify-start gap-3 border-t border-neutral-200 pt-4 mt-8'>
        <Button
          className='h-10 rounded-lg bg-purple-heart-900 px-10 hover:bg-purple-heart-800'
          type='submit'
          form={ADD_STUDENT_FORM_ID}
          isLoading={addMutation.isPending}
        >
          {t('students.addModal.save')}
        </Button>
        <Button
          variant='outline'
          className='h-10 rounded-lg border-neutral-200 px-10'
          onClick={closeModal}
          type='button'
        >
          {t('students.addModal.cancel')}
        </Button>
      </div>
    </div>
  );
};
