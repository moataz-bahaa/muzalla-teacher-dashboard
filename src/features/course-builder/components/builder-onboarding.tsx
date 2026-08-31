import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bell, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useBuilder } from '../context/builder-context';

export const BuilderOnboarding: React.FC = () => {
  const { t } = useTranslation();
  const { sections, addPage, dismissOnboarding, selectPage } = useBuilder();
  const sectionId = sections[0]?.id;

  const cards = [
    {
      title: t('courses.builder.onboarding.cards.text'),
      image:
        'https://images.unsplash.com/photo-1456513080510-7bf3ed84c82b?auto=format&fit=crop&w=400&q=80',
    },
    {
      title: t('courses.builder.onboarding.cards.media'),
      image:
        'https://images.unsplash.com/photo-1611162617474-5b21e939e113?auto=format&fit=crop&w=400&q=80',
    },
    {
      title: t('courses.builder.onboarding.cards.quiz'),
      image:
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const startFirstLesson = async () => {
    if (!sectionId) return;
    const pageId = await addPage(sectionId);
    selectPage(pageId, sectionId);
    dismissOnboarding();
  };

  return (
    <div className='rounded-2xl border border-neutral-200 bg-white p-5'>
      <div className='mb-6 flex flex-col gap-4 border-b border-neutral-100 pb-5 lg:flex-row lg:items-center lg:justify-between'>
        <div className='flex items-start gap-3'>
          <div className='flex size-10 items-center justify-center rounded-full bg-purple-heart-100 text-purple-heart-700'>
            <Bell className='size-5' />
          </div>
          <div>
            <h2 className='text-lg font-bold text-neutral-900'>
              {t('courses.builder.onboarding.title')}
            </h2>
            <p className='text-sm text-neutral-500'>
              {t('courses.builder.onboarding.subtitle')}
            </p>
          </div>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <Button
            variant='outline'
            className='rounded-lg border-neutral-200'
            onClick={dismissOnboarding}
          >
            {t('courses.builder.onboarding.skip')}
          </Button>
          <Button
            className='rounded-lg bg-purple-heart-900 hover:bg-purple-heart-800'
            onClick={() => void startFirstLesson()}
          >
            {t('courses.builder.onboarding.start')}
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {cards.map((card) => (
          <article
            key={card.title}
            className='overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50'
          >
            <div className='relative aspect-video'>
              <img src={card.image} alt='' className='size-full object-cover' />
              <div className='absolute inset-0 flex items-center justify-center bg-black/20'>
                <span className='flex size-12 items-center justify-center rounded-full bg-white/90 text-purple-heart-800'>
                  <Play className='size-5 fill-current' />
                </span>
              </div>
            </div>
            <div className='flex items-center justify-between gap-3 p-4'>
              <Button
                variant='outline'
                size='sm'
                className={cn('rounded-lg border-neutral-200 text-xs')}
              >
                {t('courses.builder.onboarding.play')}
              </Button>
              <p className='text-sm font-medium text-neutral-800'>{card.title}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
