import {
  useModalAction,
  useModalState,
} from '@/components/modal-views/context';
import { Button, CloseButton } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface IColumnConfig {
  id: string;
  name: string;
  visible: boolean;
}

export interface ITableConfigModalProps {
  initialColumnConfigs: IColumnConfig[];
  changeColumnConfigs: (newColumnConfigs: IColumnConfig[]) => void;
}

export const TableConfigModal: React.FC = () => {
  const { t } = useTranslation();
  const { closeModal } = useModalAction();
  const { data } = useModalState<ITableConfigModalProps>();
  const [columnConfigs, setColumnConfigs] = useState<IColumnConfig[]>(
    data?.initialColumnConfigs ?? [],
  );

  const move = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= columnConfigs.length) return;
    setColumnConfigs((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(nextIndex, 0, item);
      return next;
    });
  };

  const toggle = (id: string, visible: boolean) => {
    setColumnConfigs((prev) =>
      prev.map((column) =>
        column.id === id ? { ...column, visible } : column,
      ),
    );
  };

  const apply = () => {
    data?.changeColumnConfigs(columnConfigs);
    closeModal();
  };

  return (
    <div className='relative max-w-full w-4xl rounded-2xl bg-white p-6 shadow-xl sm:p-8'>
      <CloseButton
        className='absolute top-10 ltr:right-10 rtl:left-10'
        onClick={closeModal}
      />
      <h2 className='font-heading text-6xl font-bold text-purple-heart-950'>
        {t('tableConfig.title')}
      </h2>
      <p className='mt-2 text-lg text-neutral-500'>
        {t('tableConfig.description')}
      </p>

      <div className='mt-6 flex flex-col gap-3'>
        {columnConfigs.map((column, index) => (
          <div
            key={column.id}
            className='flex items-center gap-3 rounded-xl border border-neutral-200 px-3 py-2.5 w-full max-w-3xl'
          >
            <span className='text-sm font-medium text-neutral-800'>
              {column.name}
            </span>
            <div className='grow'></div>
            <div className='flex items-center gap-1'>
              <Button
                variant='outline'
                onClick={() => move(index, 1)}
                size='icon-lg'
                disabled={index === columnConfigs.length - 1}
              >
                <ChevronDown className='size-6' />
              </Button>
              <Button
                variant='outline'
                size='icon-lg'
                onClick={() => move(index, -1)}
                disabled={index === 0}
              >
                <ChevronUp className='size-6' />
              </Button>
            </div>
            <Switch
              checked={column.visible}
              onCheckedChange={(checked) => toggle(column.id, checked)}
              className='data-checked:bg-purple-heart-600'
            />
          </div>
        ))}
      </div>

      <div className='mt-8 flex items-center justify-start gap-3 border-t pt-4'>
        <Button
          className='h-10 rounded-lg bg-purple-heart-900 px-8 hover:bg-purple-heart-800'
          onClick={apply}
        >
          {t('tableConfig.apply')}
        </Button>
        <Button
          variant='outline'
          className='h-10 rounded-lg border-neutral-200 px-8'
          onClick={closeModal}
        >
          {t('tableConfig.cancel')}
        </Button>
      </div>
    </div>
  );
};
