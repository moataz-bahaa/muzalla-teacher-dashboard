import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form/input';
import { cn } from '@/lib/utils';
import type { IPageBlock } from '@/types/page-block';
import { EBlockType } from '@/types/page-block';
import { BrainCircuit } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface IQuestionBlockProps {
  block: IPageBlock;
  isTeacherView: boolean;
  onChange: (block: IPageBlock) => void;
}

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
      isCorrect: isMulti ? (i === index ? !option.isCorrect : option.isCorrect) : i === index,
    }));
    onChange({ ...block, questionOptions: next });
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2 text-purple-heart-800'>
        <BrainCircuit className='size-5' />
        <span className='font-semibold'>{t('courses.builder.blocks.testKnowledge')}</span>
      </div>

      {isTeacherView ? (
        <Input
          value={block.data}
          onChange={(e) => onChange({ ...block, data: e.target.value })}
          className='h-11 rounded-lg text-end font-medium'
          placeholder={t('courses.builder.blocks.questionPlaceholder')}
        />
      ) : (
        <p className='text-lg font-medium text-neutral-900'>{block.data}</p>
      )}

      {isWritten ? (
        isTeacherView ? (
          <textarea
            className='min-h-[120px] w-full rounded-xl border border-neutral-200 p-3'
            placeholder={t('courses.builder.blocks.writtenPlaceholder')}
            readOnly
          />
        ) : (
          <textarea
            className='min-h-[120px] w-full rounded-xl border border-neutral-200 p-3'
            placeholder={t('courses.builder.blocks.answerPlaceholder')}
          />
        )
      ) : (
        <div className='space-y-3'>
          {options.map((option, index) => (
            <label
              key={index}
              className={cn(
                'flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3',
                option.isCorrect && isTeacherView
                  ? 'border-purple-heart-500 bg-purple-heart-50'
                  : selectedIndex === index && !isTeacherView
                    ? 'border-purple-heart-500'
                    : 'border-neutral-200',
              )}
            >
              {isTeacherView ? (
                <button
                  type='button'
                  onClick={() => toggleCorrect(index)}
                  className={cn(
                    'size-5 rounded-full border',
                    option.isCorrect
                      ? 'border-purple-heart-700 bg-purple-heart-700'
                      : 'border-neutral-300',
                  )}
                />
              ) : (
                <input
                  type={isMulti ? 'checkbox' : 'radio'}
                  name={`question-${block.id}`}
                  checked={selectedIndex === index}
                  onChange={() => setSelectedIndex(index)}
                  className='size-4 accent-purple-heart-700'
                />
              )}
              {isTeacherView ? (
                <Input
                  value={option.text}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className='border-0 bg-transparent px-0 text-end shadow-none focus-visible:ring-0'
                />
              ) : (
                <span>{option.text}</span>
              )}
            </label>
          ))}
        </div>
      )}

      {!isTeacherView && !isWritten && (
        <div className='flex justify-end'>
          <Button className='rounded-lg bg-purple-heart-900 hover:bg-purple-heart-800'>
            {t('courses.builder.blocks.submitAnswer')}
          </Button>
        </div>
      )}
    </div>
  );
};
