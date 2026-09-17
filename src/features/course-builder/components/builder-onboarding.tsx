import CirclePlay from '@/components/icons/circle-play-icon';
import { Button } from '@/components/ui/button';
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
    <div className='rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm'>
      <div className='mb-6 flex flex-col gap-4 border-b border-neutral-100 pb-5 lg:flex-row lg:items-center lg:justify-between'>
        <div className='flex items-start gap-3'>
          <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-purple-heart-100'>
            <Bell className='size-5 text-purple-heart-700' />
          </div>
          <div className='text-start'>
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
            variant='ghost'
            className='rounded-lg text-neutral-600'
            onClick={dismissOnboarding}
          >
            {t('courses.builder.onboarding.skip')}
          </Button>
          <Button
            className='h-11 rounded-lg bg-purple-heart-700 px-5 hover:bg-purple-heart-600'
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
            className='flex items-center gap-6 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 px-2 py-2 shadow-md sm:gap-10'
          >
            <div className='relative shrink-0 overflow-hidden rounded-lg'>
              <img
                src={card.image}
                alt=''
                className='h-32 w-50 object-cover'
              />
              <div className='absolute inset-0 flex items-center justify-center bg-black/20'>
                <span className='flex size-12 items-center justify-center rounded-full bg-white/90 text-purple-heart-800'>
                  <Play className='size-5 fill-current' />
                </span>
              </div>
            </div>
            <div className='flex flex-1 flex-col items-start gap-5 py-3 pe-4'>
              <p className='text-xl font-medium text-neutral-800 sm:text-2xl'>
                {card.title}
              </p>
              <Button className='h-11 gap-2 rounded-lg bg-purple-heart-700 px-10 hover:bg-purple-heart-600'>
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
