import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ArrowDown,
  ArrowUp,
  Copy,
  GripVertical,
  Pencil,
  Trash2,
} from 'lucide-react';
import type { DragEvent, ReactNode } from 'react';

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
  onDragStart?: (event: DragEvent<HTMLButtonElement>) => void;
  onDragEnd?: (event: DragEvent<HTMLButtonElement>) => void;
  isDragging?: boolean;
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
  onDragStart,
  onDragEnd,
  isDragging,
  children,
}) => {
  if (!isTeacherView) {
    return (
      <div className='rounded-2xl border border-neutral-200 bg-white p-5 transition-all duration-200'>
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative rounded-2xl border bg-white p-5 transition-all duration-200',
        isDragging && 'scale-[1.01] opacity-70 shadow-lg',
        isActive
          ? 'border-purple-heart-500 shadow-[0_0_0_1px_rgba(105,0,238,0.25)]'
          : 'border-neutral-200 hover:border-purple-heart-200',
      )}
      onClick={onSelect}
    >
      <div
        className={cn(
          'absolute -end-12 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-1 transition-opacity duration-200 lg:flex',
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
          disabled={!canMoveUp}
          className='size-8 rounded-lg border-neutral-200 bg-white shadow-sm'
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
        >
          <ArrowUp className='size-4' />
        </Button>
        <Button
          type='button'
          size='icon'
          variant='outline'
          disabled={!canMoveDown}
          className='size-8 rounded-lg border-neutral-200 bg-white shadow-sm'
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown();
          }}
        >
          <ArrowDown className='size-4' />
        </Button>
      </div>

      <button
        type='button'
        draggable
        aria-label='Drag block'
        className={cn(
          'absolute -start-3 top-1/2 hidden -translate-y-1/2 cursor-grab text-neutral-300 transition-colors duration-150 active:cursor-grabbing lg:block',
          'opacity-0 group-hover:opacity-100 hover:text-purple-heart-600',
          isActive && 'opacity-100',
          isDragging && 'opacity-100 text-purple-heart-700',
        )}
        onClick={(e) => e.stopPropagation()}
        onDragStart={(e) => {
          e.stopPropagation();
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', 'block');
          onDragStart?.(e);
        }}
        onDragEnd={(e) => {
          e.stopPropagation();
          onDragEnd?.(e);
        }}
      >
        <GripVertical className='size-5' />
      </button>

      {children}
    </div>
  );
};
