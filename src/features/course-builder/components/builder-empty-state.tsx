import { Button } from '@/components/ui/button';
import { useBuilder } from '../context/builder-context';
import { GitBranchPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const BuilderEmptyState: React.FC = () => {
  const { t } = useTranslation();
  const { addSection } = useBuilder();

  return (
    <div className='flex min-h-[480px] flex-col items-center justify-center gap-6 px-6 py-16 text-center'>
      <GitBranchPlus className='size-[200px] text-neutral-300' strokeWidth={1} />
      <p className='max-w-[673px] text-2xl leading-relaxed text-neutral-700'>
        {t('courses.builder.empty.message')}
      </p>
      <Button
        className='h-14 gap-2 rounded-lg bg-purple-heart-900 px-8 text-base hover:bg-purple-heart-800'
        onClick={() => void addSection()}
      >
        {t('courses.builder.empty.addSection')}
      </Button>
    </div>
  );
};
