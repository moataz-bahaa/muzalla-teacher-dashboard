import CirclePlay from '@/components/icons/circle-play-icon';
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
          <Bell className='size-5 text-purple-heart-700' />
          <div>
            <h2 className='text-xl font-bold text-neutral-900'>
              {t('courses.builder.onboarding.title')}
            </h2>
            <p className='font-medium text-neutral-500'>
              {t('courses.builder.onboarding.subtitle')}
            </p>
          </div>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <Button
            variant='outline'
            className='rounded-lg border-none'
            onClick={dismissOnboarding}
          >
            {t('courses.builder.onboarding.skip')}
          </Button>
          <Button
            variant='purple'
            size='lg'
            className='rounded-lg bg-purple-heart-700 px-5'
            onClick={() => void startFirstLesson()}
          >
            {t('courses.builder.onboarding.start')}
          </Button>
        </div>
      </div>

      <div className='space-y-4'>
        {cards.map((card) => (
          <article
            key={card.title}
            className='overflow-hidden px-1 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center gap-10'
            style={{
              boxShadow:
                '0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -2px rgba(0, 0, 0, 0.10)',
            }}
          >
            <div className='relative aspect-video'>
              <img src={card.image} alt='' className='w-50 h-32 object-cover' />
              <div className='absolute inset-0 flex items-center justify-center bg-black/20'>
                <span className='flex size-12 items-center justify-center rounded-full bg-white/90 text-purple-heart-800'>
                  <Play className='size-5 fill-current' />
                </span>
              </div>
            </div>
            <div className='flex flex-col gap-5'>
              <p className='text-2xl font-medium text-neutral-800'>
                {card.title}
              </p>
              <Button
                variant='purple'
                size='lg'
                className={cn(
                  'rounded-lg border-neutral-200 text-white px-10 bg-purple-700',
                )}
              >
                {t('courses.builder.onboarding.play')}
                <CirclePlay className='size-4' />
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
