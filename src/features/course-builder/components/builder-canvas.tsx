import { Switch } from '@/components/ui/switch';
import type { IPage } from '@/types/page';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBuilder } from '../context/builder-context';
import { withNormalizedOrder } from '../utils/block-helpers';
import { BlockRenderer } from './blocks/block-renderer';
import { InsertBar } from './insert-bar/insert-bar';

export const BuilderCanvas: React.FC = () => {
  const { t } = useTranslation();
  const {
    selectedPageId,
    getBlocks,
    getPages,
    selectedSectionId,
    isTeacherView,
    setIsTeacherView,
    reorderBlocks,
  } = useBuilder();

  const page =
    selectedSectionId && selectedPageId
      ? getPages(selectedSectionId).find((p: IPage) => p.id === selectedPageId)
      : null;

  const blocks = selectedPageId ? getBlocks(selectedPageId) : [];
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [overId, setOverId] = useState<number | null>(null);

  if (!selectedPageId || !page) return null;

  const commitReorder = (fromId: number, toId: number) => {
    const fromIndex = blocks.findIndex((block) => block.id === fromId);
    const toIndex = blocks.findIndex((block) => block.id === toId);
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;

    const next = [...blocks];
    const [removed] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, removed!);
    reorderBlocks(withNormalizedOrder(next));
  };

  return (
    <div className='relative flex min-h-160 flex-col gap-6 pb-28'>
      <div className='flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm animate-in fade-in-0 duration-300'>
        <div className='text-start'>
          <p className='text-sm font-medium text-purple-heart-800'>
            {isTeacherView
              ? t('courses.builder.canvas.teacherView')
              : t('courses.builder.canvas.studentView')}
          </p>
          <p className='text-xs text-neutral-500'>
            {t('courses.builder.canvas.viewHint')}
          </p>
        </div>
        <Switch
          checked={isTeacherView}
          onCheckedChange={setIsTeacherView}
          className='data-checked:bg-purple-heart-700'
        />
      </div>

      <h1 className='text-3xl font-bold text-neutral-900 animate-in fade-in-0 slide-in-from-top-1 duration-300'>
        {page.name}
      </h1>

      <div className='space-y-6 pe-0 lg:pe-10'>
        {blocks.map((block, index) => (
          <div
            key={block.id}
            onDragOver={(event) => {
              event.preventDefault();
              if (overId !== block.id) setOverId(block.id);
            }}
            onDrop={(event) => {
              event.preventDefault();
              if (draggingId !== null) {
                commitReorder(draggingId, block.id);
              }
              setDraggingId(null);
              setOverId(null);
            }}
            className={
              overId === block.id && draggingId !== block.id
                ? 'translate-y-1 rounded-2xl ring-2 ring-purple-heart-200 ring-offset-2 transition-all duration-200'
                : 'transition-all duration-200 animate-in fade-in-0 slide-in-from-bottom-2 duration-300'
            }
          >
            <BlockRenderer
              block={block}
              index={index}
              total={blocks.length}
              isDragging={draggingId === block.id}
              onDragStart={() => setDraggingId(block.id)}
              onDragEnd={() => {
                if (draggingId !== null && overId !== null) {
                  commitReorder(draggingId, overId);
                }
                setDraggingId(null);
                setOverId(null);
              }}
            />
          </div>
        ))}
      </div>

      {isTeacherView && <InsertBar />}
    </div>
  );
};
