import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';
import { Label } from '../label';

export interface PasswordInputProps extends React.ComponentProps<'input'> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, label, containerClassName, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputType = showPassword ? 'text' : 'password';
    return (
      <div className={cn('flex w-full flex-col gap-1.5', containerClassName)}>
        {label && (
          <Label
            htmlFor={props.name}
            className='text-sm font-medium text-neutral-800'
          >
            {label}
          </Label>
        )}
        <div className='relative'>
          <input
            ref={ref}
            type={inputType}
            data-slot='input'
            className={cn(
              'h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
              'h-12 rounded-lg border-neutral-200 bg-neutral-100 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 md:text-sm',
              error && 'border-danger-500',
              className,
            )}
            {...props}
          />
          <button
            type='button'
            className='absolute end-3 top-1/2 -translate-y-1/2 text-neutral-400'
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className='size-4' />
            ) : (
              <Eye className='size-4' />
            )}
          </button>
        </div>
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
