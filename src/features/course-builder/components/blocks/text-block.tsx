import { Input } from '@/components/ui/form/input';
import { cn } from '@/lib/utils';
import type { IPageBlock } from '@/types/page-block';
import { getTextBlockClassName, isTextBlockType } from '../../utils/block-helpers';
import { EBlockType } from '@/types/page-block';
import { useEffect, useRef } from 'react';

interface ITextBlockProps {
  block: IPageBlock;
  isTeacherView: boolean;
  onChange: (block: IPageBlock) => void;
}

export const TextBlock: React.FC<ITextBlockProps> = ({
  block,
  isTeacherView,
  onChange,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== block.data) {
      ref.current.innerHTML = block.data;
    }
  }, [block.id, block.data]);

  if (block.type === EBlockType.Quote) {
    return (
      <blockquote className='border-s-4 border-purple-heart-500 ps-4 text-lg italic text-neutral-700'>
        {isTeacherView ? (
          <Input
            value={block.data}
            onChange={(e) => onChange({ ...block, data: e.target.value })}
            className='border-0 bg-transparent px-0 shadow-none focus-visible:ring-0'
          />
        ) : (
          block.data
        )}
      </blockquote>
    );
  }

  if (block.type === EBlockType.Notes) {
    return (
      <div className='rounded-xl bg-warning-50 p-4 text-sm text-neutral-700'>
        {isTeacherView ? (
          <textarea
            value={block.data}
            onChange={(e) => onChange({ ...block, data: e.target.value })}
            className='min-h-[80px] w-full bg-transparent outline-none'
          />
        ) : (
          block.data
        )}
      </div>
    );
  }

  if (block.type === EBlockType.HorizontalDivider) {
    return <hr className='border-neutral-200' />;
  }

  if (block.type === EBlockType.VerticalDivider) {
    return <div className='mx-auto h-24 w-px bg-neutral-200' />;
  }

  if (block.type === EBlockType.Table) {
    return (
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse text-sm'>
          <tbody>
            {[0, 1].map((row) => (
              <tr key={row}>
                {[0, 1].map((col) => (
                  <td key={col} className='border border-neutral-200 p-2'>
                    {isTeacherView ? (
                      <Input className='h-8 border-0 shadow-none focus-visible:ring-0' />
                    ) : (
                      '—'
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!isTextBlockType(block.type)) return null;

  return (
    <div
      ref={ref}
      contentEditable={isTeacherView}
      suppressContentEditableWarning
      className={cn(
        'outline-none',
        getTextBlockClassName(block.type),
        isTeacherView && 'min-h-[1.5em]',
      )}
      onBlur={() => {
        if (ref.current) {
          onChange({ ...block, data: ref.current.innerHTML });
        }
      }}
    />
  );
};
