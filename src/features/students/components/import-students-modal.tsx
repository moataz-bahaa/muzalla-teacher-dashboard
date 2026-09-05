import { FilesDropzone } from '@/components/files-dropzone';
import ExcelIcon from '@/components/icons/excel-icon';
import { useModalAction } from '@/components/modal-views/context';
import { Button, CloseButton } from '@/components/ui/button';
import { useImportStudentsMutation } from '@/lib/data/students';
import { FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const ACCEPTED =
  'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const isSpreadsheetFile = (file: File) =>
  file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

export const ImportStudentsModal: React.FC = () => {
  const { t } = useTranslation();
  const { closeModal } = useModalAction();
  const [file, setFile] = useState<File | null>(null);

  const importMutation = useImportStudentsMutation({
    onSuccess: () => {
      closeModal();
    },
  });

  const upload = () => {
    if (!file) return;
    importMutation.mutate(file);
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

      <FilesDropzone
        className='mt-6'
        accept={ACCEPTED}
        hint={t('students.importModal.dropHint')}
        browseLabel={t('students.importModal.browse')}
        maxFileSize={MAX_FILE_SIZE}
        maxSizeHint={t('students.importModal.maxSize')}
        value={file}
        onChange={setFile}
        emptyIcon={<ExcelIcon className='size-12' />}
        validateFile={(selectedFile) =>
          isSpreadsheetFile(selectedFile)
            ? null
            : t('students.importModal.invalidType')
        }
        onValidationError={(message) => toast.error(message)}
      />

      <div className='btn-group mt-8'>
        <Button
          className='h-10 rounded-lg bg-purple-heart-900 px-10 hover:bg-purple-heart-800'
          onClick={upload}
          disabled={!file}
          isLoading={importMutation.isPending}
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
