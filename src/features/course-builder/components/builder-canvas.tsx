import { Switch } from '@/components/ui/switch';
import type { IPage } from '@/types/page';
import type { IPageBlock } from '@/types/page-block';
import { useEffect, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useBuilder } from '../context/builder-context';
import { withNormalizedOrder } from '../utils/block-helpers';
import { BlockRenderer } from './blocks/block-renderer';
import { InsertBar } from './insert-bar/insert-bar';

interface IBlocksFormValues {
  blocks: IPageBlock[];
}

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

  const form = useForm<IBlocksFormValues>({
    values: { blocks },
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: 'blocks',
    keyName: 'fieldKey',
  });

  useEffect(() => {
    replace(blocks);
  }, [blocks, replace]);

  if (!selectedPageId || !page) return null;

  const commitReorder = (fromId: number, toId: number) => {
    const fromIndex = fields.findIndex((field) => field.id === fromId);
    const toIndex = fields.findIndex((field) => field.id === toId);
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;

    const next = [...fields];
    const [removed] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, removed!);

    const reordered = withNormalizedOrder(
      next.map((field) => {
        const { fieldKey: _fieldKey, ...block } = field as IPageBlock & {
          fieldKey: string;
        };
        return block;
      }),
    );

    replace(reordered);
    reorderBlocks(reordered);
  };

  return (
    <FormProvider {...form}>
      <div className='relative flex min-h-160 flex-col gap-6 pb-28'>
        <div className='flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm animate-in fade-in-0 duration-300'>
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

        <h1 className='text-end text-3xl font-bold text-neutral-900 animate-in fade-in-0 slide-in-from-top-1 duration-300'>
          {page.name}
        </h1>

        <div className='space-y-6 pe-0 lg:pe-10'>
          {fields.map((field, index) => (
            <div
              key={field.fieldKey}
              onDragOver={(event) => {
                event.preventDefault();
                if (overId !== field.id) setOverId(field.id);
              }}
              onDrop={(event) => {
                event.preventDefault();
                if (draggingId !== null) {
                  commitReorder(draggingId, field.id);
                }
                setDraggingId(null);
                setOverId(null);
              }}
              className={
                overId === field.id && draggingId !== field.id
                  ? 'translate-y-1 rounded-2xl ring-2 ring-purple-heart-200 ring-offset-2 transition-all duration-200'
                  : 'transition-all duration-200 animate-in fade-in-0 slide-in-from-bottom-2 duration-300'
              }
            >
              <BlockRenderer
                block={field}
                index={index}
                total={fields.length}
                isDragging={draggingId === field.id}
                onDragStart={() => setDraggingId(field.id)}
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
    </FormProvider>
  );
};
