import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FilesIcon from './icons/files-icon';

const formatFileSize = (bytes: number) => {
  if (bytes >= 1024 * 1024) {
    return `${Math.round(bytes / (1024 * 1024))} MB`;
  }
  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${bytes} B`;
};

interface IFilesDropzoneBaseProps {
  label?: string;
  hint?: string;
  browseLabel?: string;
  maxFileSize?: number;
  maxSizeHint?: string;
  error?: string;
  accept?: string;
  className?: string;
  emptyIcon?: React.ReactNode;
  validateFile?: (file: File) => string | null;
  onValidationError?: (message: string) => void;
}

export interface IFilesDropzoneSingleProps extends IFilesDropzoneBaseProps {
  isMultiple?: false;
  value?: File | null;
  onChange: (file: File | null) => void;
}

export interface IFilesDropzoneMultipleProps extends IFilesDropzoneBaseProps {
  isMultiple: true;
  value?: File[];
  onChange: (files: File[]) => void;
}

export type TFilesDropzoneProps =
  | IFilesDropzoneSingleProps
  | IFilesDropzoneMultipleProps;

export const FilesDropzone: React.FC<TFilesDropzoneProps> = (props) => {
  const {
    label,
    hint,
    browseLabel,
    maxFileSize,
    maxSizeHint,
    error,
    accept,
    className,
    emptyIcon,
    validateFile,
    onValidationError,
    isMultiple = false,
  } = props;
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const displayError = error ?? internalError ?? undefined;

  const maxSizeLabel =
    maxSizeHint ??
    (maxFileSize
      ? t('common.maxFileSize', { size: formatFileSize(maxFileSize) })
      : undefined);

  const selectedNames = isMultiple
    ? Array.isArray(props.value)
      ? props.value.map((file) => file.name)
      : [props.value?.name ?? '']
    : props.value
      ? [
          Array.isArray(props.value)
            ? props.value[0]?.name
            : (props.value?.name ?? ''),
        ]
      : [];

  const validateFiles = (files: File[]): File[] => {
    const valid: File[] = [];

    for (const file of files) {
      if (maxFileSize && file.size > maxFileSize) {
        const message = t('common.fileTooLarge', {
          size: formatFileSize(maxFileSize),
        });
        setInternalError(message);
        onValidationError?.(message);
        continue;
      }

      const customError = validateFile?.(file);
      if (customError) {
        setInternalError(customError);
        onValidationError?.(customError);
        continue;
      }

      valid.push(file);
    }

    return valid;
  };

  const applyFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;

    const files = Array.from(fileList);
    const validFiles = validateFiles(files);

    if (!validFiles.length) return;

    setInternalError(null);

    if (props.isMultiple) {
      props.onChange(validFiles);
      return;
    }

    props.onChange(validFiles[0] ?? null);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyFiles(event.target.files);
    event.target.value = '';
  };

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDragging(false);
    applyFiles(event.dataTransfer.files);
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label ? (
        <p className='text-sm font-medium text-neutral-700'>{label}</p>
      ) : null}
      <button
        type='button'
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-10 text-center transition-colors',
          dragging
            ? 'border-purple-heart-500 bg-purple-heart-50'
            : 'border-purple-heart-300 bg-purple-heart-100',
        )}
      >
        {emptyIcon ?? <FilesIcon className='size-12' />}
        {(hint || browseLabel) && (
          <p className='text-sm text-neutral-700'>
            {hint}{' '}
            <span className='font-semibold text-purple-heart-700'>
              {browseLabel ?? t('common.browse')}
            </span>
          </p>
        )}
        {maxSizeLabel ? (
          <p className='text-xs text-neutral-500'>{maxSizeLabel}</p>
        ) : null}
        {selectedNames.length > 0 ? (
          <div className='mt-1 flex flex-col gap-0.5'>
            {selectedNames.map((name) => (
              <p
                key={name}
                className='text-xs font-medium text-purple-heart-800'
              >
                {name}
              </p>
            ))}
          </div>
        ) : null}
      </button>
      <input
        ref={fileInputRef}
        type='file'
        accept={accept}
        multiple={isMultiple}
        className='hidden'
        onChange={handleInputChange}
      />
      {displayError ? (
        <span className='text-xs text-red-500'>{displayError}</span>
      ) : null}
    </div>
  );
};
