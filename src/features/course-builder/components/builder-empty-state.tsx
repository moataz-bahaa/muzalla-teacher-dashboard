import DataFlowIcon from '@/components/icons/data-flow-icon';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useBuilder } from '../context/builder-context';

export const BuilderEmptyState: React.FC = () => {
  const { t } = useTranslation();
  const { addSection } = useBuilder();

  return (
    <div className='flex min-h-120 flex-col items-center justify-center gap-6 px-6 py-16 text-center'>
      <DataFlowIcon className='size-42 text-neutral-400' />
      <p className='max-w-2xl text-2xl font-bold leading-relaxed text-neutral-400'>
        {t('courses.builder.empty.message')}
      </p>
      <Button
        className='h-14 gap-2 rounded-lg bg-purple-heart-900 px-8 text-base hover:bg-purple-heart-800'
        onClick={() => void addSection()}
      >
        <PlusIcon className='size-6' />
        {t('courses.builder.empty.addSection')}
      </Button>
    </div>
  );
};
