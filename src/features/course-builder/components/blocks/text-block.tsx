import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { IPageBlock } from '@/types/page-block';
import { EBlockType } from '@/types/page-block';
import { Minus, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  getTextBlockClassName,
  isTextBlockType,
  parseTableData,
  serializeTableData,
  type ITableBlockData,
} from '../../utils/block-helpers';
import { RichTextEditor } from './rich-text-editor';

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
  const { t } = useTranslation();

  if (block.type === EBlockType.Quote) {
    return (
      <blockquote className='border-s-4 border-purple-heart-500 ps-4 text-lg italic text-neutral-700'>
        {isTeacherView ? (
          <RichTextEditor
            value={block.data}
            onChange={(html) => onChange({ ...block, data: html })}
            contentClassName='text-lg italic'
          />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: block.data }} />
        )}
      </blockquote>
    );
  }

  if (block.type === EBlockType.Notes) {
    return (
      <div className='rounded-xl bg-warning-50 p-4 text-sm text-neutral-700 transition-shadow duration-200 focus-within:shadow-[0_0_0_1px_rgba(245,158,11,0.35)]'>
        {isTeacherView ? (
          <Textarea
            value={block.data}
            onChange={(e) => onChange({ ...block, data: e.target.value })}
            className='min-h-[120px] resize-y border-0 bg-transparent text-end shadow-none focus-visible:border-transparent focus-visible:ring-0'
            placeholder={t('courses.builder.blocks.notesPlaceholder', {
              defaultValue: 'اكتب ملاحظة...',
            })}
          />
        ) : (
          <p className='whitespace-pre-wrap text-end'>{block.data}</p>
        )}
      </div>
    );
  }

  if (block.type === EBlockType.HorizontalDivider) {
    return (
      <div className='flex w-full items-center py-4' role='separator' aria-orientation='horizontal'>
        <div className='h-px w-full bg-neutral-200' />
      </div>
    );
  }

  if (block.type === EBlockType.VerticalDivider) {
    return (
      <div
        className='flex min-h-[160px] w-full items-stretch justify-center py-2'
        role='separator'
        aria-orientation='vertical'
      >
        <div className='w-px self-stretch bg-neutral-300' aria-hidden />
      </div>
    );
  }

  if (block.type === EBlockType.Table) {
    return (
      <TableBlockEditor
        block={block}
        isTeacherView={isTeacherView}
        onChange={onChange}
      />
    );
  }

  if (!isTextBlockType(block.type)) return null;

  if (!isTeacherView) {
    return (
      <div
        className={cn(getTextBlockClassName(block.type))}
        dangerouslySetInnerHTML={{ __html: block.data }}
      />
    );
  }

  return (
    <RichTextEditor
      value={block.data}
      onChange={(html) => onChange({ ...block, data: html })}
      contentClassName={getTextBlockClassName(block.type)}
      placeholder={t('courses.builder.blocks.textPlaceholder', {
        defaultValue: 'اكتب النص هنا...',
      })}
    />
  );
};

interface ITableBlockEditorProps {
  block: IPageBlock;
  isTeacherView: boolean;
  onChange: (block: IPageBlock) => void;
}

const TableBlockEditor: React.FC<ITableBlockEditorProps> = ({
  block,
  isTeacherView,
  onChange,
}) => {
  const { t } = useTranslation();
  const table = parseTableData(block.data);

  const commit = (next: ITableBlockData) => {
    onChange({ ...block, data: serializeTableData(next) });
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const rows = table.rows.map((row, r) =>
      row.map((cell, c) => (r === rowIndex && c === colIndex ? value : cell)),
    );
    commit({ ...table, rows });
  };

  const setDimensions = (rowCount: number, columnCount: number) => {
    const safeRows = Math.max(1, Math.min(20, rowCount));
    const safeCols = Math.max(1, Math.min(12, columnCount));
    const rows = Array.from({ length: safeRows }, (_, r) =>
      Array.from({ length: safeCols }, (_, c) => table.rows[r]?.[c] ?? ''),
    );
    commit({ rows, rowCount: safeRows, columnCount: safeCols });
  };

  return (
    <div className='space-y-3'>
      {isTeacherView && (
        <div className='flex flex-wrap items-center justify-end gap-3'>
          <div className='flex items-center gap-2 rounded-lg border border-neutral-200 px-2 py-1'>
            <span className='text-xs text-neutral-500'>
              {t('courses.builder.blocks.rows', { defaultValue: 'صفوف' })}
            </span>
            <Button
              type='button'
              size='icon'
              variant='ghost'
              className='size-7'
              onClick={() => setDimensions(table.rowCount - 1, table.columnCount)}
            >
              <Minus className='size-3.5' />
            </Button>
            <span className='min-w-6 text-center text-sm font-medium'>
              {table.rowCount}
            </span>
            <Button
              type='button'
              size='icon'
              variant='ghost'
              className='size-7'
              onClick={() => setDimensions(table.rowCount + 1, table.columnCount)}
            >
              <Plus className='size-3.5' />
            </Button>
          </div>
          <div className='flex items-center gap-2 rounded-lg border border-neutral-200 px-2 py-1'>
            <span className='text-xs text-neutral-500'>
              {t('courses.builder.blocks.columns', { defaultValue: 'أعمدة' })}
            </span>
            <Button
              type='button'
              size='icon'
              variant='ghost'
              className='size-7'
              onClick={() => setDimensions(table.rowCount, table.columnCount - 1)}
            >
              <Minus className='size-3.5' />
            </Button>
            <span className='min-w-6 text-center text-sm font-medium'>
              {table.columnCount}
            </span>
            <Button
              type='button'
              size='icon'
              variant='ghost'
              className='size-7'
              onClick={() => setDimensions(table.rowCount, table.columnCount + 1)}
            >
              <Plus className='size-3.5' />
            </Button>
          </div>
        </div>
      )}

      <div className='overflow-x-auto rounded-xl border border-neutral-200'>
        <table className='w-full border-collapse text-sm'>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className='animate-in fade-in-0 duration-200'>
                {row.map((cell, colIndex) => (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    className='border border-neutral-200 p-2 align-top'
                  >
                    {isTeacherView ? (
                      <Input
                        value={cell}
                        onChange={(e) =>
                          updateCell(rowIndex, colIndex, e.target.value)
                        }
                        className='h-9 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0'
                      />
                    ) : (
                      <span className='block min-h-6 px-1'>{cell || '—'}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
