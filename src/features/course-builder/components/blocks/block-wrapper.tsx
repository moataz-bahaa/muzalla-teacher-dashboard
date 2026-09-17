import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Copy, GripVertical, Pencil, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';

interface IBlockWrapperProps {
  isActive: boolean;
  isTeacherView: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  children: ReactNode;
}

export const BlockWrapper: React.FC<IBlockWrapperProps> = ({
  isActive,
  isTeacherView,
  onSelect,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  children,
}) => {
  if (!isTeacherView) {
    return (
      <div className='rounded-2xl border border-neutral-200 bg-white p-5'>
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative rounded-2xl border bg-white p-5 transition-shadow',
        isActive
          ? 'border-purple-heart-500 shadow-[0_0_0_1px_rgba(105,0,238,0.25)]'
          : 'border-neutral-200 hover:border-purple-heart-200',
      )}
      onClick={onSelect}
    >
      {/* Figma: action tools on visual left (inline-end in RTL) */}
      <div
        className={cn(
          'absolute -end-12 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-1 transition-opacity lg:flex',
          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
        )}
      >
        <Button
          type='button'
          size='icon'
          variant='outline'
          className='size-8 rounded-lg border-neutral-200 bg-white shadow-sm'
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          <Pencil className='size-4' />
        </Button>
        <Button
          type='button'
          size='icon'
          variant='outline'
          className='size-8 rounded-lg border-neutral-200 bg-white shadow-sm'
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className='size-4' />
        </Button>
        <Button
          type='button'
          size='icon'
          variant='outline'
          className='size-8 rounded-lg border-neutral-200 bg-white shadow-sm'
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
        >
          <Copy className='size-4' />
        </Button>
        <Button
          type='button'
          size='icon'
          variant='outline'
          disabled={!canMoveUp && !canMoveDown}
          className='size-8 cursor-grab rounded-lg border-neutral-200 bg-white shadow-sm'
          onClick={(e) => {
            e.stopPropagation();
            if (canMoveUp) onMoveUp();
            else if (canMoveDown) onMoveDown();
          }}
        >
          <GripVertical className='size-4' />
        </Button>
      </div>

      {/* Figma: drag handle on visual right (inline-start in RTL) */}
      <div className='absolute -start-3 top-1/2 hidden -translate-y-1/2 text-neutral-300 lg:block'>
        <GripVertical className='size-5' />
      </div>

      {children}
    </div>
  );
};
