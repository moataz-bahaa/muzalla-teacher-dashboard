import { Switch } from '@/components/ui/switch';
import type { IPage } from '@/types/page';
import type { IPageBlock } from '@/types/page-block';
import { useTranslation } from 'react-i18next';
import { useBuilder } from '../context/builder-context';
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
  } = useBuilder();

  const page =
    selectedSectionId && selectedPageId
      ? getPages(selectedSectionId).find((p: IPage) => p.id === selectedPageId)
      : null;
  const blocks = selectedPageId ? getBlocks(selectedPageId) : [];

  if (!selectedPageId || !page) return null;

  return (
    <div className='relative flex min-h-160 flex-col gap-6 pb-28'>
      <div className='flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm'>
        <Switch
          checked={isTeacherView}
          onCheckedChange={setIsTeacherView}
          className='data-checked:bg-purple-heart-700'
        />
        <div className='text-end'>
          <p className='text-sm font-medium text-purple-heart-800'>
            {isTeacherView
              ? t('courses.builder.canvas.teacherView')
              : t('courses.builder.canvas.studentView')}
          </p>
          <p className='text-xs text-neutral-500'>
            {t('courses.builder.canvas.viewHint')}
          </p>
        </div>
      </div>

      <h1 className='text-end text-3xl font-bold text-neutral-900'>{page.name}</h1>

      <div className='space-y-6 pe-0 lg:pe-10'>
        {blocks.map((block: IPageBlock, index: number) => (
          <BlockRenderer
            key={block.id}
            block={block}
            index={index}
            total={blocks.length}
          />
        ))}
      </div>

      {isTeacherView && <InsertBar />}
    </div>
  );
};
