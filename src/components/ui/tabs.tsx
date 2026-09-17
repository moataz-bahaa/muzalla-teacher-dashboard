import { cn } from '@/lib/utils';

export interface ITabItem {
  value: string;
  label: string;
}

export type TTabsVariant = 'underline' | 'segmented';

export interface ITabsProps {
  currentActive: string;
  items: ITabItem[];
  onChange: (value: string) => void;
  className?: string;
  variant?: TTabsVariant;
}

export const Tabs: React.FC<ITabsProps> = ({
  currentActive,
  items,
  onChange,
  className,
  variant = 'underline',
}) => {
  if (variant === 'segmented') {
    return (
      <div
        className={cn('flex rounded-xl bg-purple-heart-100 p-1', className)}
        role='tablist'
      >
        {items.map((item) => {
          const isActive = currentActive === item.value;

          return (
            <button
              key={item.value}
              type='button'
              role='tab'
              aria-selected={isActive}
              onClick={() => onChange(item.value)}
              className={cn(
                'flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:text-sm',
                isActive
                  ? 'bg-white text-purple-heart-900 shadow-sm'
                  : 'text-purple-heart-900/70 hover:text-purple-heart-900',
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex shrink-0 gap-2 border-b border-neutral-200 px-8 pt-4',
        className,
      )}
      role='tablist'
    >
      {items.map((item) => {
        const isActive = currentActive === item.value;

        return (
          <button
            key={item.value}
            type='button'
            role='tab'
            aria-selected={isActive}
            onClick={() => onChange(item.value)}
            className={cn(
              'rounded-t-lg px-4 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-purple-heart-100 text-purple-heart-800'
                : 'text-neutral-500 hover:text-neutral-800',
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
