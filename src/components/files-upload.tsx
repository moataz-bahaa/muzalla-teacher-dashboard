import { cn } from '@/lib/utils';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import FilesIcon from './icons/files-icon';

interface IFilesUploadBaseProps {
  label?: string;
  hint?: string;
  browseLabel?: string;
  previewUrl?: string | null;
  error?: string;
  accept?: string;
  className?: string;
  emptyIcon?: React.ReactNode;
}

export interface IFilesUploadSingleProps extends IFilesUploadBaseProps {
  isMultiple?: false;
  value?: File | null;
  onChange: (file: File | null) => void;
}

export interface IFilesUploadMultipleProps extends IFilesUploadBaseProps {
  isMultiple: true;
  value?: File[];
  onChange: (files: File[]) => void;
}

export type TFilesUploadProps =
  | IFilesUploadSingleProps
  | IFilesUploadMultipleProps;

export const FilesUpload: React.FC<TFilesUploadProps> = (props) => {
  const {
    label,
    hint,
    browseLabel,
    previewUrl = null,
    error,
    accept = 'image/*',
    className,
    emptyIcon,
    isMultiple = false,
  } = props;
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const singleFile =
    !isMultiple && props.value instanceof File ? props.value : null;
  const multipleFiles =
    isMultiple && Array.isArray(props.value) ? props.value : [];

  const preview = useMemo(() => {
    if (isMultiple) {
      const first = multipleFiles[0];
      if (first) return URL.createObjectURL(first);
      return previewUrl;
    }
    if (singleFile) return URL.createObjectURL(singleFile);
    return previewUrl;
  }, [isMultiple, multipleFiles, singleFile, previewUrl]);

  useEffect(() => {
    if (!preview?.startsWith('blob:')) return;
    return () => {
      URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (props.isMultiple) {
      props.onChange(fileList ? Array.from(fileList) : []);
      return;
    }
    props.onChange(fileList?.[0] ?? null);
  };

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label ? (
        <p className='text-sm font-medium text-neutral-700'>{label}</p>
      ) : null}
      <button
        type='button'
        onClick={() => fileInputRef.current?.click()}
        className='flex items-center gap-2 rounded border h-14 border-dashed border-purple-heart-500 text-center'
      >
        {(hint || browseLabel) && (
          <p className='text-xs text-neutral-500 px-2 max-w-60'>
            {hint}{' '}
            <span className='text-purple-heart-700 underline'>
              {browseLabel ?? t('common.browse')}
            </span>
          </p>
        )}
        <div className='border-r border-dashed border-purple-heart-500 bg-neutra h-full px-2 flex items-center justify-center'>
          {preview ? (
            <img
              src={preview}
              alt=''
              className='size-12 rounded object-cover'
            />
          ) : (
            (emptyIcon ?? <FilesIcon className='w-[2.4rem] h-[1.52rem]' />)
          )}
        </div>
        <input
          ref={fileInputRef}
          type='file'
          accept={accept}
          multiple={isMultiple}
          className='hidden'
          onChange={handleChange}
        />
      </button>
      {error ? <span className='text-xs text-red-500'>{error}</span> : null}
    </div>
  );
};
