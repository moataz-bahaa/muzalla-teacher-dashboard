import { cn } from '@/lib/utils';
import { EBlockType } from '@/types/page-block';
import { useTranslation } from 'react-i18next';

interface IInsertPopoverProps {
  slot: 'text' | 'image' | 'video' | 'question' | 'more';
  options: EBlockType[];
  onSelect: (type: EBlockType) => void;
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

  return (
    <div className='absolute bottom-[calc(100%+12px)] left-1/2 min-w-[220px] -translate-x-1/2 rounded-2xl border border-neutral-700 bg-neutral-900 p-2 shadow-2xl'>
      <div className='absolute -bottom-2 left-1/2 size-4 -translate-x-1/2 rotate-45 border-b border-r border-neutral-700 bg-neutral-900' />
      {options.map((type) => (
        <button
          key={type}
          type='button'
          onClick={() => onSelect(type)}
          className={cn(
            'flex w-full items-center justify-end rounded-xl px-4 py-3 text-sm text-white hover:bg-neutral-800',
          )}
        >
          {getLabel(type)}
        </button>
      ))}
    </div>
  );
};
