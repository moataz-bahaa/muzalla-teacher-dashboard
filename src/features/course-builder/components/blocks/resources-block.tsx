import { Input } from '@/components/ui/form/input';
import type { IPageBlock } from '@/types/page-block';
import { ExternalLink, Link2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { parseExternalLinkData } from '../../utils/block-helpers';

interface IResourcesBlockProps {
  block: IPageBlock;
  isTeacherView: boolean;
  onChange: (block: IPageBlock) => void;
}

export const ResourcesBlock: React.FC<IResourcesBlockProps> = ({
  block,
  isTeacherView,
  onChange,
}) => {
  const { t } = useTranslation();
  const link = parseExternalLinkData(block.data);

  return (
    <div className='flex min-w-0 items-center gap-3 overflow-hidden rounded-xl border border-neutral-200 p-4'>
      <ExternalLink className='size-4 shrink-0 text-neutral-500' />
      <div className='min-w-0 flex-1 overflow-hidden'>
        {isTeacherView ? (
          <>
            <Input
              value={link.title ?? ''}
              onChange={(e) =>
                onChange({
                  ...block,
                  data: JSON.stringify({ ...link, title: e.target.value }),
                })
              }
              placeholder={t('courses.builder.blocks.linkTitle')}
              className='mb-1 h-8 min-w-0 truncate border-0 bg-transparent px-0 text-start shadow-none focus-visible:ring-0'
            />
            <Input
              dir='ltr'
              value={link.href}
              onChange={(e) =>
                onChange({
                  ...block,
                  data: JSON.stringify({ ...link, href: e.target.value }),
                })
              }
              placeholder={t('courses.builder.blocks.urlPlaceholder')}
              className='h-8 min-w-0 truncate border-0 bg-transparent px-0 text-start text-xs text-neutral-500 shadow-none focus-visible:ring-0'
            />
          </>
        ) : (
          <a
            href={link.href}
            target='_blank'
            rel='noreferrer'
            className='block min-w-0'
          >
            <p className='truncate font-medium' title={link.title || link.href}>
              {link.title || link.href}
            </p>
            <p
              className='truncate text-xs text-neutral-500'
              title={link.source || link.href}
              dir='ltr'
            >
              {link.source || link.href}
            </p>
          </a>
        )}
      </div>
      <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-heart-100 text-purple-heart-700'>
        <Link2 className='size-5' />
      </div>
    </div>
  );
};
