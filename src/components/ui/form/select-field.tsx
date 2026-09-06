import { useLevelsQuery } from '@/lib/data/constants';
import { cn } from '@/lib/utils';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Label } from '../label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';

interface ISelectFieldProps {
  options: {
    label: string;
    value: string;
  }[];
  label?: string;
  error?: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const SelectField: React.FC<ISelectFieldProps> = ({
  options,
  label,
  error,
  className,
  value,
  onChange,
  disabled,
}) => {
  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className='h-11 w-full rounded-lg'>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className='text-xs text-danger-600'>{error}</p>}
    </div>
  );
};

export interface IControlledSelectFieldProps<
  T extends FieldValues,
> extends Omit<ISelectFieldProps, 'value' | 'onChange'> {
  control: Control<T>;
  name: FieldPath<T>;
}

export function ControlledSelectField<T extends FieldValues>({
  control,
  name,
  ...props
}: IControlledSelectFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <SelectField
          {...props}
          value={field.value ?? ''}
          onChange={field.onChange}
          error={props.error ?? fieldState.error?.message}
        />
      )}
    />
  );
}

export type TControlledYearSelectProps<T extends FieldValues> = Omit<
  IControlledSelectFieldProps<T>,
  'options'
>;

export function ControlledLevelSelect<T extends FieldValues>({
  control,
  name,
  label,
  ...props
}: TControlledYearSelectProps<T>) {
  const { t } = useTranslation();
  const { levels, isPending } = useLevelsQuery();

  return (
    <ControlledSelectField
      control={control}
      name={name}
      label={label ?? t('students.addModal.academicYear')}
      options={levels.map((level) => ({
        label: t(`students.academicYears.${level.code}`, {
          defaultValue: level.name,
        }),
        value: String(level.id),
      }))}
      {...props}
      disabled={isPending || props.disabled}
    />
  );
}
