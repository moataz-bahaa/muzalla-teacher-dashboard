import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface IAuthFileFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  hint?: string;
  accept?: string;
}

export function FileField<T extends FieldValues>({
  control,
  name,
  label,
  hint,
  accept = 'image/*',
}: IAuthFileFieldProps<T>) {
  const { t } = useTranslation();

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { value, onChange, onBlur, ref, name: fieldName },
        fieldState,
      }) => {
        const file =
          (value as unknown) instanceof File
            ? (value as unknown as File)
            : undefined;

        return (
          <div className='flex w-full flex-col gap-1.5 text-start'>
            <Label
              htmlFor={fieldName}
              className='text-sm font-medium text-neutral-800'
            >
              {label}
            </Label>
            <label
              htmlFor={fieldName}
              className={cn(
                'flex h-12 cursor-pointer items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-neutral-100 px-4 text-sm',
                fieldState.error && 'border-danger-500',
              )}
            >
              <span
                className={cn(
                  'truncate',
                  file ? 'text-neutral-900' : 'text-neutral-400',
                )}
              >
                {file?.name ?? hint}
              </span>
              <span className='shrink-0 font-medium text-purple-heart-700'>
                {file ? t('common.change') : t('common.browse')}
              </span>
            </label>
            <input
              id={fieldName}
              name={fieldName}
              ref={ref}
              type='file'
              accept={accept}
              className='sr-only'
              onBlur={onBlur}
              onChange={(event) => {
                const next = event.target.files?.[0];
                onChange(next ?? undefined);
              }}
            />
            {fieldState.error?.message ? (
              <p className='text-xs text-danger-600'>
                {fieldState.error.message}
              </p>
            ) : null}
          </div>
        );
      }}
    />
  );
}
