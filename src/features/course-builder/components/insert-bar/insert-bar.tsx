import { cn } from '@/lib/utils';
import { EBlockType } from '@/types/page-block';
import { HelpCircle, ImageIcon, Plus, Type, Video } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBuilder } from '../../context/builder-context';
import { InsertPopover } from './insert-popover';

type TInsertSlot = 'text' | 'image' | 'video' | 'question' | 'more';

const slotToBlockTypes: Record<TInsertSlot, EBlockType[]> = {
  text: [
    EBlockType.H1,
    EBlockType.H2,
    EBlockType.H3,
    EBlockType.Body,
    EBlockType.SmallText,
  ],
  image: [EBlockType.Image],
  video: [EBlockType.Video],
  question: [
    EBlockType.QuestionSingleChoice,
    EBlockType.QuestionMultipleChoice,
    EBlockType.QuestionWritten,
  ],
  more: [
    EBlockType.Image,
    EBlockType.Video,
    EBlockType.Audio,
    EBlockType.Pdf,
    EBlockType.Body,
    EBlockType.ExternalLink,
    EBlockType.HorizontalDivider,
    EBlockType.VerticalDivider,
    EBlockType.Table,
    EBlockType.Quote,
    EBlockType.Notes,
  ],
};

export const InsertBar: React.FC = () => {
  const { t } = useTranslation();
  const { addBlock, selectedPageId } = useBuilder();
  const [activeSlot, setActiveSlot] = useState<TInsertSlot | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(event.target as Node)) {
        setActiveSlot(null);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  if (!selectedPageId) return null;

  const slots: { id: TInsertSlot; label: string; icon: React.ReactNode }[] = [
    { id: 'text', label: t('courses.builder.insert.text'), icon: <Type className='size-5' /> },
    {
      id: 'image',
      label: t('courses.builder.insert.image'),
      icon: <ImageIcon className='size-5' />,
    },
    {
      id: 'video',
      label: t('courses.builder.insert.video'),
      icon: <Video className='size-5' />,
    },
    {
      id: 'question',
      label: t('courses.builder.insert.question'),
      icon: <HelpCircle className='size-5' />,
    },
    { id: 'more', label: t('courses.builder.insert.more'), icon: <Plus className='size-5' /> },
  ];

  const handleSelectType = (type: EBlockType, data?: string) => {
    addBlock(type, undefined, data);
    setActiveSlot(null);
  };

  return (
    <div
      ref={barRef}
      className='pointer-events-none sticky bottom-6 z-20 flex justify-center'
    >
      <div className='pointer-events-auto relative'>
        {activeSlot && (
          <InsertPopover
            slot={activeSlot}
            options={slotToBlockTypes[activeSlot]}
            onSelect={handleSelectType}
            onClose={() => setActiveSlot(null)}
          />
        )}

        <div className='flex items-center gap-0.5 rounded-full bg-neutral-800 px-2 py-1.5 shadow-xl animate-in fade-in-0 slide-in-from-bottom-2 duration-300'>
          {slots.map((slot) => {
            const isActive = activeSlot === slot.id;
            return (
              <button
                key={slot.id}
                type='button'
                onClick={() => setActiveSlot(isActive ? null : slot.id)}
                className={cn(
                  'flex min-w-[72px] flex-col items-center gap-1 rounded-full px-3 py-2 text-[11px] text-white transition-all duration-200',
                  isActive
                    ? 'scale-105 bg-purple-heart-700'
                    : 'hover:bg-neutral-700',
                )}
              >
                {slot.icon}
                <span>{slot.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
