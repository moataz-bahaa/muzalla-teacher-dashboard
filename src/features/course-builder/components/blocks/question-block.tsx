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
  const isMulti = block.type === EBlockType.QuestionMultipleChoice;
  const isWritten = block.type === EBlockType.QuestionWritten;
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

  const addOption = () => {
    const next: IQuestionOption[] = [
      ...options,
      {
        text: t('courses.builder.blocks.newOption', {
          defaultValue: 'New option',
        }),
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
        <div className='space-y-3'>
          {options.map((option, index) => (
            <label
              key={index}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-150',
                option.isCorrect && isTeacherView
                  ? 'border-purple-heart-500 bg-purple-heart-50'
                  : selectedIndex === index && !isTeacherView
                    ? 'border-purple-heart-500'
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
                    'size-5 shrink-0 rounded-full border transition-colors',
                    option.isCorrect
                      ? 'border-purple-heart-700 bg-purple-heart-700'
                      : 'border-neutral-300',
                  )}
                  aria-label={t('courses.builder.blocks.markCorrect', {
                    defaultValue: 'Mark as correct',
                  })}
                />
              ) : (
                <input
                  type={isMulti ? 'checkbox' : 'radio'}
                  name={`question-${block.id}`}
                  checked={selectedIndex === index}
                  onChange={() => setSelectedIndex(index)}
                  className='size-4 shrink-0 accent-purple-heart-700'
                />
              )}
              {isTeacherView ? (
                <Input
                  value={option.text}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className='h-9 flex-1 border-0 bg-transparent px-0 text-start shadow-none focus-visible:ring-0'
                />
              ) : (
                <span className='flex-1 text-start'>{option.text}</span>
              )}
              {isTeacherView && (
                <button
                  type='button'
                  onClick={(e) => {
                    e.preventDefault();
                    removeOption(index);
                  }}
                  disabled={options.length <= MIN_OPTIONS}
                  className='shrink-0 rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-danger-50 hover:text-danger-600 disabled:pointer-events-none disabled:opacity-40'
                  aria-label={t('courses.builder.blocks.deleteOption', {
                    defaultValue: 'Delete option',
                  })}
                >
                  <Trash2 className='size-4' />
                </button>
              )}
            </label>
          ))}

          {isTeacherView && (
            <Button
              type='button'
              variant='outline'
              className='h-11 w-full gap-2 rounded-xl border-dashed border-neutral-300 text-neutral-700'
              onClick={addOption}
            >
              <Plus className='size-4' />
              {t('courses.builder.blocks.addOption', {
                defaultValue: 'Add option',
              })}
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
