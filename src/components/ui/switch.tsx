import * as React from 'react'
import { Switch as SwitchPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

function Switch({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: 'sm' | 'default'
}) {
  return (
    <SwitchPrimitive.Root
      data-slot='switch'
      data-size={size}
      className={cn(
        'peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none',
        'after:absolute after:-inset-x-3 after:-inset-y-2',
        'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
        'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
        'data-[size=default]:h-[18.4px] data-[size=default]:w-[32px]',
        'data-[size=sm]:h-[14px] data-[size=sm]:w-[24px]',
        'data-checked:bg-primary data-unchecked:bg-input',
        'data-disabled:cursor-not-allowed data-disabled:opacity-50',
        'dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:data-unchecked:bg-input/80',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot='switch-thumb'
        className={cn(
          'pointer-events-none absolute top-1/2 block -translate-y-1/2 rounded-full bg-background ring-0',
          // Logical inset so unchecked sits at inline-start and checked at inline-end in both LTR and RTL
          'start-0.5 transition-[inset-inline-start]',
          'group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3',
          'group-data-[state=checked]/switch:group-data-[size=default]/switch:start-[calc(100%-1rem-2px)]',
          'group-data-[state=checked]/switch:group-data-[size=sm]/switch:start-[calc(100%-0.75rem-2px)]',
          'dark:group-data-[state=checked]/switch:bg-primary-foreground',
          'dark:group-data-[state=unchecked]/switch:bg-foreground',
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
