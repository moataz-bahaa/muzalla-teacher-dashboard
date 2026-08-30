import ExcelIcon from '@/components/icons/excel-icon';
import {
  useModalAction,
  useModalState,
} from '@/components/modal-views/context';
import { Button, CloseButton } from '@/components/ui/button';
import { MOCK_IMPORT_PREVIEW } from '@/features/students/data/mock-students';
import type { IStudent } from '@/types/student';
import { FileSpreadsheet } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const ACCEPTED =
  '.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export interface IImportStudentsModalData {
  onImported?: (students: IStudent[]) => void;
}

export const ImportStudentsModal: React.FC = () => {
  const { t } = useTranslation();
  const { closeModal, openModal } = useModalAction();
  const { data } = useModalState<IImportStudentsModalData>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const acceptFile = (file?: File) => {
    if (!file) return;
    const valid =
      file.name.endsWith('.csv') ||
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls');
    if (!valid) {
      toast.error(t('students.importModal.invalidType'));
      return;
    }
    setFileName(file.name);
  };

  const upload = () => {
    closeModal();
    openModal('VERIFY_IMPORT_DATA', {
      students: MOCK_IMPORT_PREVIEW,
      onConfirm: data?.onImported,
    });
  };

  return (
    <div className='relative max-w-full w-4xl rounded-2xl bg-white p-6 shadow-xl sm:p-8'>
      <CloseButton
        className='absolute top-10 ltr:right-10 rtl:left-10'
        onClick={closeModal}
      />
      <h2 className='font-heading text-2xl font-bold text-purple-heart-950'>
        {t('students.importModal.title')}
      </h2>

      <div className='mt-4 flex border-b border-neutral-200'>
        <div className='flex items-center gap-2 border-b-2 border-purple-heart-700 px-1 pb-3 text-sm font-semibold text-purple-heart-800'>
          <FileSpreadsheet className='size-4' />
          {t('students.importModal.tab')}
        </div>
      </div>

      <div className='mt-6 space-y-3 text-lg text-neutral-900'>
        <p>{t('students.importModal.intro')}</p>
        <p>{t('students.importModal.rule1')}</p>
        <p>{t('students.importModal.rule2')}</p>
      </div>

      <button
        type='button'
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          acceptFile(event.dataTransfer.files?.[0]);
        }}
        className={`mt-6 flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-10 text-center transition-colors ${
          dragging
            ? 'border-purple-heart-500 bg-purple-heart-50'
            : 'border-purple-heart-300 bg-purple-heart-100'
        }`}
      >
        <ExcelIcon className='size-12' />
        <p className='text-sm text-neutral-700'>
          {t('students.importModal.dropHint')}{' '}
          <span className='font-semibold text-purple-heart-700'>
            {t('students.importModal.browse')}
          </span>
        </p>
        <p className='text-xs text-neutral-500'>
          {t('students.importModal.maxSize')}
        </p>
        {fileName && (
          <p className='mt-1 text-xs font-medium text-purple-heart-800'>
            {fileName}
          </p>
        )}
      </button>
      <input
        ref={inputRef}
        type='file'
        accept={ACCEPTED}
        className='hidden'
        onChange={(event) => acceptFile(event.target.files?.[0])}
      />

      <div className='btn-group mt-8'>
        <Button
          className='h-10 rounded-lg bg-purple-heart-900 px-10 hover:bg-purple-heart-800'
          onClick={upload}
        >
          {t('students.importModal.upload')}
        </Button>
        <Button
          variant='outline'
          className='h-10 rounded-lg border-neutral-200 px-10'
          onClick={closeModal}
        >
          {t('students.importModal.cancel')}
        </Button>
      </div>
    </div>
  );
};
