import {
  useModalAction,
  useModalState,
} from '@/components/modal-views/context';
import { Button, CloseButton } from '@/components/ui/button';
import { useMutation } from '@/hooks/use-mutation';
import { client } from '@/lib/data/client';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

type DeleteObject = 'course' | 'student' | 'user' | 'section';

const getDeleteFuction = (object: DeleteObject) => {
  switch (object) {
    case 'course':
      return client.courses.delete;
    case 'student':
      return client.students.delete;
    default:
      return async () => {
        throw new Error('Invalid delete object');
      };
  }
};

export interface IDeleteModalData {
  object: DeleteObject;
  id: number;
  title?: string;
  description?: string;
  onSuccess?: () => void;
}
export const DeleteModal: React.FC = () => {
  const { t } = useTranslation();
  const { closeModal } = useModalAction();
  const { data } = useModalState<IDeleteModalData>();

  if (!data) {
    throw Error('No data found');
  }

  const deleteMutation = useMutation({
    mutationKey: ['delete', data?.object],
    mutationFn: getDeleteFuction(data?.object as DeleteObject),
    onSuccess: () => {
      toast.success(t('common.delete.success', { object: data?.object ?? '' }));
      data?.onSuccess?.();
      closeModal();
    },
  });

  const onConfirm = () => {
    deleteMutation.mutate(data?.id);
  };

  return (
    <div className='relative z-10 flex w-full max-w-2xl flex-col gap-4 rounded-xl border-2 border-red-500 bg-white p-10 text-start'>
      <CloseButton
        className='absolute top-4 ltr:right-4 rtl:left-4'
        onClick={closeModal}
      />
      <h2 className='font-heading text-xl font-bold text-neutral-900'>
        {data?.title ??
          t('common.delete.title', { object: data?.object ?? '' })}
      </h2>
      <p className='text-sm text-neutral-500'>
        {data?.description ??
          t('common.delete.description', { object: data?.object ?? '' })}
      </p>
      <div className='flex justify-center gap-3 pt-2'>
        <Button
          className='bg-danger-500 px-5 text-white hover:bg-danger-700'
          onClick={onConfirm}
        >
          {t('common.delete.confirm')}
        </Button>
        <Button variant='outline' onClick={closeModal} className='px-10'>
          {t('common.cancel')}
        </Button>
      </div>
    </div>
  );
};
