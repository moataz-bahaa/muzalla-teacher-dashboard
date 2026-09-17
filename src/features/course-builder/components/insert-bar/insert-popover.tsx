import { cn } from '@/lib/utils';
import { EBlockType } from '@/types/page-block';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createEmptyTable, serializeTableData } from '../../utils/block-helpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form/input';

interface IInsertPopoverProps {
  slot: 'text' | 'image' | 'video' | 'question' | 'more';
  options: EBlockType[];
  onSelect: (type: EBlockType, data?: string) => void;
  onClose: () => void;
}

const textLabels: Partial<Record<EBlockType, string>> = {
  [EBlockType.H1]: 'Title 1',
  [EBlockType.H2]: 'Title 2',
  [EBlockType.H3]: 'Title 3',
  [EBlockType.Body]: 'Body text',
  [EBlockType.SmallText]: 'Small text',
};

const moreLabels: Partial<Record<EBlockType, string>> = {
  [EBlockType.Image]: 'Image',
  [EBlockType.Video]: 'Video',
  [EBlockType.Audio]: 'Audio',
  [EBlockType.Pdf]: 'PDF viewer',
  [EBlockType.Body]: 'Text',
  [EBlockType.ExternalLink]: 'Link',
  [EBlockType.HorizontalDivider]: 'Horizontal divider',
  [EBlockType.VerticalDivider]: 'Vertical divider',
  [EBlockType.Table]: 'Table',
  [EBlockType.Quote]: 'Quote',
  [EBlockType.Notes]: 'Notes',
};

const questionLabels: Partial<Record<EBlockType, string>> = {
  [EBlockType.QuestionSingleChoice]: 'Single choice',
  [EBlockType.QuestionMultipleChoice]: 'Multiple choice',
  [EBlockType.QuestionWritten]: 'Written answer',
};

export const InsertPopover: React.FC<IInsertPopoverProps> = ({
  slot,
  options,
  onSelect,
}) => {
  const { t } = useTranslation();
  const [tableSetup, setTableSetup] = useState(false);
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);

  const getLabel = (type: EBlockType) => {
    if (slot === 'text') {
      return t(`courses.builder.insert.textOptions.${type}`, {
        defaultValue: textLabels[type] ?? String(type),
      });
    }
    if (slot === 'question') {
      return t(`courses.builder.insert.questionOptions.${type}`, {
        defaultValue: questionLabels[type] ?? String(type),
      });
    }
    if (slot === 'more') {
      return t(`courses.builder.insert.moreOptions.${type}`, {
        defaultValue: moreLabels[type] ?? String(type),
      });
    }
    if (slot === 'image') return t('courses.builder.insert.uploadImage');
    if (slot === 'video') return t('courses.builder.insert.uploadVideo');
    return String(type);
  };

  if (tableSetup) {
    return (
      <div className='absolute bottom-[calc(100%+12px)] left-1/2 z-30 w-[260px] -translate-x-1/2 rounded-2xl border border-neutral-700 bg-neutral-900 p-4 text-white shadow-2xl animate-in fade-in-0 zoom-in-95'>
        <p className='mb-3 text-end text-sm font-medium'>
          {t('courses.builder.blocks.tableSetup', {
            defaultValue: 'إعداد الجدول',
          })}
        </p>
        <div className='mb-3 flex gap-3'>
          <label className='flex flex-1 flex-col gap-1 text-xs text-neutral-300'>
            {t('courses.builder.blocks.rows', { defaultValue: 'صفوف' })}
            <Input
              type='number'
              min={1}
              max={20}
              value={rows}
              onChange={(e) => setRows(Number(e.target.value) || 1)}
              className='h-9 border-neutral-600 bg-neutral-800 text-white'
            />
          </label>
          <label className='flex flex-1 flex-col gap-1 text-xs text-neutral-300'>
            {t('courses.builder.blocks.columns', { defaultValue: 'أعمدة' })}
            <Input
              type='number'
              min={1}
              max={12}
              value={cols}
              onChange={(e) => setCols(Number(e.target.value) || 1)}
              className='h-9 border-neutral-600 bg-neutral-800 text-white'
            />
          </label>
        </div>
        <div className='flex gap-2'>
          <Button
            type='button'
            variant='outline'
            className='flex-1 border-neutral-600 bg-transparent text-white'
            onClick={() => setTableSetup(false)}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type='button'
            className='flex-1 bg-purple-heart-700 hover:bg-purple-heart-600'
            onClick={() =>
              onSelect(
                EBlockType.Table,
                serializeTableData(createEmptyTable(rows, cols)),
              )
            }
          >
            {t('courses.builder.blocks.insertTable', {
              defaultValue: 'إدراج',
            })}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='absolute bottom-[calc(100%+12px)] left-1/2 min-w-[220px] -translate-x-1/2 rounded-2xl border border-neutral-700 bg-neutral-900 p-2 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150'>
      <div className='absolute -bottom-2 left-1/2 size-4 -translate-x-1/2 rotate-45 border-b border-r border-neutral-700 bg-neutral-900' />
      {options.map((type) => (
        <button
          key={type}
          type='button'
          onClick={() => {
            if (type === EBlockType.Table) {
              setTableSetup(true);
              return;
            }
            onSelect(type);
          }}
          className={cn(
            'flex w-full items-center justify-end rounded-xl px-4 py-3 text-sm text-white transition-colors hover:bg-neutral-800',
          )}
        >
          {getLabel(type)}
        </button>
      ))}
    </div>
  );
};
