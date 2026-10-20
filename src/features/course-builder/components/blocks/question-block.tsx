import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { IPageBlock, IQuestionOption } from '@/types/page-block';
import { EBlockType } from '@/types/page-block';
import { BrainCircuit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface IQuestionBlockProps {
  block: IPageBlock;
  isTeacherView: boolean;
  onChange: (block: IPageBlock) => void;
}

const MIN_OPTIONS = 2;

export const QuestionBlock: React.FC<IQuestionBlockProps> = ({
  block,
  isTeacherView,
  onChange,
}) => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(
    () => new Set(),
  );
  const blockType = Number(block.type) as EBlockType;
  const isMulti = blockType === EBlockType.QuestionMultipleChoice;
  const isWritten = blockType === EBlockType.QuestionWritten;
  const options = block.questionOptions ?? [];

  const updateOption = (index: number, text: string) => {
    const next = options.map((option, i) =>
      i === index ? { ...option, text } : option,
    );
    onChange({ ...block, questionOptions: next });
  };

  const toggleCorrect = (index: number) => {
    const next = options.map((option, i) => ({
      ...option,
      isCorrect: isMulti
        ? i === index
          ? !option.isCorrect
          : option.isCorrect
        : i === index,
    }));
    onChange({ ...block, questionOptions: next });
  };

  const toggleStudentChoice = (index: number) => {
    if (isMulti) {
      setSelectedIndexes((prev) => {
        const next = new Set(prev);
        if (next.has(index)) next.delete(index);
        else next.add(index);
        return next;
      });
      return;
    }
    setSelectedIndex(index);
  };

  const isStudentSelected = (index: number) =>
    isMulti ? selectedIndexes.has(index) : selectedIndex === index;

  const addOption = () => {
    const next: IQuestionOption[] = [
      ...options,
      {
        text: t('courses.builder.blocks.newOption'),
        isCorrect: false,
        order: options.length,
      },
    ];
    onChange({ ...block, questionOptions: next });
  };

  const removeOption = (index: number) => {
    if (options.length <= MIN_OPTIONS) return;
    const next = options
      .filter((_, i) => i !== index)
      .map((option, i) => ({ ...option, order: i }));
    if (!isMulti && !next.some((option) => option.isCorrect) && next[0]) {
      next[0] = { ...next[0], isCorrect: true };
    }
    onChange({ ...block, questionOptions: next });
  };

  return (
    <div className='space-y-4 animate-in fade-in-0 duration-200'>
      <div className='flex items-center gap-2 text-purple-heart-800'>
        <BrainCircuit className='size-5' />
        <span className='font-semibold'>
          {t('courses.builder.blocks.testKnowledge')}
        </span>
      </div>

      {isTeacherView ? (
        <Textarea
          value={block.data}
          onChange={(e) => onChange({ ...block, data: e.target.value })}
          className='min-h-[88px] resize-y rounded-xl border-neutral-200 bg-white text-start font-medium transition-shadow duration-200 focus-visible:border-purple-heart-400'
          placeholder={t('courses.builder.blocks.questionPlaceholder')}
        />
      ) : (
        <p className='text-start text-lg font-medium text-neutral-900'>
          {block.data}
        </p>
      )}

      {isWritten ? (
        <Textarea
          className='min-h-[140px] w-full resize-y rounded-xl border-neutral-200 bg-white p-3 text-start transition-shadow duration-200 focus-visible:border-purple-heart-400'
          placeholder={
            isTeacherView
              ? t('courses.builder.blocks.writtenPlaceholder')
              : t('courses.builder.blocks.answerPlaceholder')
          }
          readOnly={isTeacherView}
        />
      ) : (
        <div className='space-y-3' role={isMulti ? 'group' : 'radiogroup'}>
          {options.map((option, index) => {
            const selected = isStudentSelected(index);
            return (
              <div
                key={index}
                role={isMulti ? 'checkbox' : 'radio'}
                aria-checked={!isTeacherView ? selected : undefined}
                tabIndex={isTeacherView ? undefined : 0}
                onClick={() => {
                  if (!isTeacherView) toggleStudentChoice(index);
                }}
                onKeyDown={(e) => {
                  if (isTeacherView) return;
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleStudentChoice(index);
                  }
                }}
                className={cn(
                  'flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-150',
                  isTeacherView ? 'cursor-default' : 'cursor-pointer',
                  option.isCorrect && isTeacherView
                    ? 'border-purple-heart-500 bg-purple-heart-50'
                    : selected && !isTeacherView
                      ? 'border-purple-heart-500 bg-purple-heart-50'
                      : 'border-neutral-200 hover:border-purple-heart-200',
                )}
              >
                {isTeacherView ? (
                  <button
                    type='button'
                    onClick={(e) => {
                      e.preventDefault();
                      toggleCorrect(index);
                    }}
                    className={cn(
                      'size-5 shrink-0 border transition-colors',
                      isMulti ? 'rounded-md' : 'rounded-full',
                      option.isCorrect
                        ? 'border-purple-heart-700 bg-purple-heart-700'
                        : 'border-neutral-300',
                    )}
                    aria-label={t('courses.builder.blocks.markCorrect')}
                  />
                ) : (
                  <span
                    className={cn(
                      'flex size-5 shrink-0 items-center justify-center border transition-colors',
                      isMulti ? 'rounded-md' : 'rounded-full',
                      selected
                        ? 'border-purple-heart-700 bg-purple-heart-700'
                        : 'border-neutral-300 bg-white',
                    )}
                    aria-hidden
                  >
                    {selected && isMulti && (
                      <span className='size-2 rounded-sm bg-white' />
                    )}
                    {selected && !isMulti && (
                      <span className='size-2 rounded-full bg-white' />
                    )}
                  </span>
                )}
                {isTeacherView ? (
                  <Input
                    value={option.text}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className='h-9 min-w-0 flex-1 border-0 bg-transparent px-0 text-start shadow-none focus-visible:ring-0'
                  />
                ) : (
                  <span className='min-w-0 flex-1 truncate text-start'>
                    {option.text}
                  </span>
                )}
                {isTeacherView && (
                  <button
                    type='button'
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeOption(index);
                    }}
                    disabled={options.length <= MIN_OPTIONS}
                    className='shrink-0 rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-danger-50 hover:text-danger-600 disabled:pointer-events-none disabled:opacity-40'
                    aria-label={t('courses.builder.blocks.deleteOption')}
                  >
                    <Trash2 className='size-4' />
                  </button>
                )}
              </div>
            );
          })}

          {isTeacherView && (
            <Button
              type='button'
              variant='outline'
              className='h-11 w-full gap-2 rounded-xl border-dashed border-neutral-300 text-neutral-700'
              onClick={addOption}
            >
              <Plus className='size-4' />
              {t('courses.builder.blocks.addOption')}
            </Button>
          )}
        </div>
      )}

      {!isTeacherView && !isWritten && (
        <div className='flex justify-center pt-2'>
          <Button className='rounded-lg bg-purple-heart-900 px-8 hover:bg-purple-heart-800'>
            {t('courses.builder.blocks.submitAnswer')}
          </Button>
        </div>
      )}
    </div>
  );
};
