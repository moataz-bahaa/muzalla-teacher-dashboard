import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form/input';
import type { IPageBlock } from '@/types/page-block';
import { EBlockType } from '@/types/page-block';
import { Download, ExternalLink, FileText, Link2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { parseExternalLinkData, parseMediaData } from '../../utils/block-helpers';

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

  if (block.type === EBlockType.ExternalLink) {
    const link = parseExternalLinkData(block.data);
    return (
      <div className='flex items-center justify-between rounded-xl border border-neutral-200 p-4'>
        <ExternalLink className='size-4 text-neutral-500' />
        <div className='flex items-center gap-3'>
          <div className='text-end'>
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
                  className='mb-1 h-8 border-0 bg-transparent px-0 text-end shadow-none focus-visible:ring-0'
                />
                <Input
                  value={link.href}
                  onChange={(e) =>
                    onChange({
                      ...block,
                      data: JSON.stringify({ ...link, href: e.target.value }),
                    })
                  }
                  className='h-8 border-0 bg-transparent px-0 text-end text-xs text-neutral-500 shadow-none focus-visible:ring-0'
                />
              </>
            ) : (
              <>
                <p className='font-medium'>{link.title}</p>
                <p className='text-xs text-neutral-500'>{link.source || link.href}</p>
              </>
            )}
          </div>
          <div className='flex size-10 items-center justify-center rounded-lg bg-purple-heart-100 text-purple-heart-700'>
            <Link2 className='size-5' />
          </div>
        </div>
      </div>
    );
  }

  const media = parseMediaData(block.data);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <span className='rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600'>
          2 {t('courses.builder.blocks.files')}
        </span>
        <h3 className='text-lg font-bold'>{t('courses.builder.blocks.resources')}</h3>
      </div>

      <div className='space-y-3'>
        <div className='flex items-center justify-between rounded-xl border border-neutral-200 p-4'>
          <Download className='size-4 text-neutral-500' />
          <div className='flex items-center gap-3'>
            <div className='text-end'>
              <p className='font-medium'>{media.name ?? 'Human Interface Guidelines'}</p>
              <p className='text-xs text-neutral-500'>PDF • 4.2 MB</p>
            </div>
            <div className='flex size-10 items-center justify-center rounded-lg bg-danger-100 text-danger-700'>
              <FileText className='size-5' />
            </div>
          </div>
        </div>

        {isTeacherView && (
          <Button
            variant='outline'
            className='w-full rounded-lg'
            onClick={() => document.querySelector<HTMLInputElement>('#resource-file')?.click()}
          >
            {t('courses.builder.blocks.addResource')}
          </Button>
        )}
        <input
          id='resource-file'
          type='file'
          className='hidden'
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            onChange({
              ...block,
              data: JSON.stringify({
                url: URL.createObjectURL(file),
                name: file.name,
                size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
              }),
            });
          }}
        />
      </div>
    </div>
  );
};
