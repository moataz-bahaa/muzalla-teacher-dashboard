import { Input } from '@/components/ui/form/input';
import type { IPageBlock } from '@/types/page-block';
import { BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { parseLinkToPageData } from '../../utils/block-helpers';

interface IRelatedLessonsBlockProps {
  block: IPageBlock;
  isTeacherView: boolean;
  onChange: (block: IPageBlock) => void;
}

export const RelatedLessonsBlock: React.FC<IRelatedLessonsBlockProps> = ({
  block,
  isTeacherView,
  onChange,
}) => {
  const { t } = useTranslation();
  const data = parseLinkToPageData(block.data);

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-bold text-neutral-900'>
        {t('courses.builder.blocks.relatedLessons', {
          defaultValue: 'Related lesson',
        })}
      </h3>
      <div className='flex items-center gap-3 rounded-xl border border-neutral-200 p-4'>
        <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-heart-100 text-purple-heart-700'>
          <BookOpen className='size-5' />
        </div>
        <div className='min-w-0 flex-1 space-y-2'>
          {isTeacherView ? (
            <>
              <Input
                value={data.title}
                onChange={(e) =>
                  onChange({
                    ...block,
                    data: JSON.stringify({ ...data, title: e.target.value }),
                  })
                }
                placeholder={t('courses.builder.blocks.lessonTitle', {
                  defaultValue: 'Lesson title',
                })}
                className='h-9'
              />
              <Input
                type='number'
                value={data.pageId || ''}
                onChange={(e) =>
                  onChange({
                    ...block,
                    data: JSON.stringify({
                      ...data,
                      pageId: Number(e.target.value) || 0,
                    }),
                  })
                }
                placeholder={t('courses.builder.blocks.pageId', {
                  defaultValue: 'Page id',
                })}
                className='h-9'
              />
            </>
          ) : (
            <p className='font-medium'>{data.title}</p>
          )}
        </div>
      </div>
    </div>
  );
};
