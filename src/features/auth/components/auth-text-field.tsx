import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface IAuthTextFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  placeholder?: string
  type?: React.HTMLInputTypeAttribute
  autoComplete?: string
}

export function AuthTextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  autoComplete,
}: IAuthTextFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className='flex w-full flex-col gap-1.5'>
          <Label htmlFor={name} className='text-sm font-medium text-neutral-800'>
            {label}
          </Label>
          <Input
            {...field}
            id={name}
            type={type}
            autoComplete={autoComplete}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
            className={cn(
              'h-12 rounded-lg border-neutral-200 bg-neutral-100 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 md:text-sm',
              fieldState.error && 'border-danger-500',
            )}
          />
          {fieldState.error?.message ? (
            <p className='text-xs text-danger-600'>{fieldState.error.message}</p>
          ) : null}
        </div>
      )}
    />
  )
}
