import {
  useModalAction,
  useModalState,
} from '@/components/modal-views/context';
import { Button, CloseButton } from '@/components/ui/button';
import { useMutation } from '@/hooks/use-mutation';
import { client } from '@/lib/data/client';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

type DeleteObject = 'course' | 'user' | 'section';

const getDeleteFuction = (object: DeleteObject) => {
  switch (object) {
    case 'course':
      return client.courses.delete;
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
      closeModal();
    },
  });

  const onConfirm = () => {
    deleteMutation.mutate(data?.id);
    closeModal();
  };

  return (
    <div className='flex flex-col gap-4 text-start border-red-500 border-2 relative p-10 rounded-xl z-10 bg-white max-w-2xl'>
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
