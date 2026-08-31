import type { IPageBlock } from '@/types/page-block';
import { EBlockType } from '@/types/page-block';
import { BookOpen, ChevronLeft } from 'lucide-react';
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
  const data = parseLinkToPageData(block.data);
  const cards = [
    { title: data.title || 'نظرية الألوان المتقدمة', subtitle: '45 دقيقة' },
    { title: 'الطباعة الرقمية', subtitle: '30 دقيقة' },
  ];

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-bold text-neutral-900'>دروس متعلقة</h3>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        {cards.map((card, index) => (
          <div
            key={index}
            className='flex items-center justify-between rounded-xl border border-neutral-200 p-4'
          >
            <ChevronLeft className='size-4 text-neutral-400' />
            <div className='flex items-center gap-3'>
              <div className='text-end'>
                {isTeacherView ? (
                  <input
                    value={index === 0 ? data.title : card.title}
                    onChange={(e) =>
                      onChange({
                        ...block,
                        type: EBlockType.LinkToPage,
                        data: JSON.stringify({ ...data, title: e.target.value }),
                      })
                    }
                    className='w-full bg-transparent text-end font-medium outline-none'
                  />
                ) : (
                  <p className='font-medium'>{card.title}</p>
                )}
                <p className='text-xs text-neutral-500'>{card.subtitle}</p>
              </div>
              <div className='flex size-10 items-center justify-center rounded-lg bg-purple-heart-100 text-purple-heart-700'>
                <BookOpen className='size-5' />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
