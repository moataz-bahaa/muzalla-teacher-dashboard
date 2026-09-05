import {
  useModalAction,
  useModalState,
} from '@/components/modal-views/context';
import { Button, CloseButton } from '@/components/ui/button';
import { StudentForm } from '@/features/students/components/student-form';
import { useEditStudentMutation } from '@/lib/data/students';
import type { ICreateStudentInput, IStudent } from '@/types/student';
import type { SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const EDIT_STUDENT_FORM_ID = 'edit-student-form';

export interface IEditStudentModalData {
  student: IStudent;
  onSuccess?: () => void;
}

export const EditStudentModal: React.FC = () => {
  const { t } = useTranslation();
  const { closeModal } = useModalAction();
  const { data } = useModalState<IEditStudentModalData>();

  if (!data?.student) {
    throw new Error('EditStudentModal requires a student payload');
  }

  const { student } = data;

  const editMutation = useEditStudentMutation({
    onSuccess: () => {
      data.onSuccess?.();
      closeModal();
    },
  });

  const onSubmit: SubmitHandler<ICreateStudentInput> = (values) => {
    editMutation.mutate({
      id: student.id,
      firstName: values.firstName,
      lastName: values.lastName,
      username: values.username,
      phoneNumber: values.phoneNumber,
    });
  };

  return (
    <div className='relative max-w-full w-4xl rounded-2xl bg-white p-6 shadow-xl sm:p-8'>
      <CloseButton
        className='absolute top-4 ltr:right-4 rtl:left-4'
        onClick={closeModal}
      />
      <StudentForm
        id={EDIT_STUDENT_FORM_ID}
        mode='edit'
        title={t('students.editModal.title')}
        initialValues={{
          firstName: student.firstName,
          lastName: student.lastName,
          username: student.username,
          phoneNumber: student.phoneNumber?.replace(/^\+20/, ''),
          password: '',
          imageProfile: null,
          avatarUrl: student.profileImage ?? undefined,
        }}
        onSubmit={onSubmit}
      />

      <div className='mt-8 flex items-center justify-end gap-3'>
        <Button
          className='h-10 rounded-lg bg-purple-heart-900 px-10 hover:bg-purple-heart-800'
          type='submit'
          form={EDIT_STUDENT_FORM_ID}
          disabled={editMutation.isPending}
        >
          {t('students.editModal.save')}
        </Button>
        <Button
          variant='outline'
          className='h-10 rounded-lg border-neutral-200 px-10'
          onClick={closeModal}
          type='button'
        >
          {t('students.editModal.cancel')}
        </Button>
      </div>
    </div>
  );
};
