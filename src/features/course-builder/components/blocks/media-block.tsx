import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form/input';
import { cn } from '@/lib/utils';
import type { IPageBlock } from '@/types/page-block';
import { EBlockType } from '@/types/page-block';
import { CloudUpload, Film, ImagePlus, Link2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBuilder } from '../../context/builder-context';
import {
  getYoutubeEmbedUrl,
  parseMediaData,
} from '../../utils/block-helpers';

interface IMediaBlockProps {
  block: IPageBlock;
  isTeacherView: boolean;
  onChange: (block: IPageBlock) => void;
}

const YoutubeEmbed: React.FC<{ src: string; title?: string }> = ({
  src,
  title,
}) => (
  <div className='aspect-video w-full overflow-hidden rounded-xl bg-black'>
    <iframe
      src={src}
      title={title ?? 'YouTube video'}
      className='size-full border-0'
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      allowFullScreen
      referrerPolicy='strict-origin-when-cross-origin'
    />
  </div>
);

const VideoPlayer: React.FC<{ url: string; name?: string }> = ({
  url,
  name,
}) => {
  const embedUrl = getYoutubeEmbedUrl(url);
  if (embedUrl) {
    return <YoutubeEmbed src={embedUrl} title={name} />;
  }
  return (
    <video controls className='aspect-video w-full rounded-xl bg-black'>
      <source src={url} />
    </video>
  );
};

export const MediaBlock: React.FC<IMediaBlockProps> = ({
  block,
  isTeacherView,
  onChange,
}) => {
  const { t } = useTranslation();
  const { setBlockPendingFile } = useBuilder();
  const fileRef = useRef<HTMLInputElement>(null);
  const [urlDraft, setUrlDraft] = useState('');
  const media = parseMediaData(block.data);
  const hasMedia = Boolean(media.url && media.url !== '');

  const isVideo = block.type === EBlockType.Video;
  const isAudio = block.type === EBlockType.Audio;
  const isPdf = block.type === EBlockType.Pdf;

  const setUrl = (url: string, name?: string) => {
    setBlockPendingFile(block.id, null);
    onChange({
      ...block,
      data: JSON.stringify({ url, name: name ?? url }),
    });
  };

  const onFile = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setBlockPendingFile(block.id, file);
    onChange({
      ...block,
      data: JSON.stringify({
        url: previewUrl,
        name: file.name,
        size: String(file.size),
      }),
    });
  };

  if (hasMedia && !isTeacherView) {
    if (isVideo) {
      return <VideoPlayer url={media.url} name={media.name} />;
    }
    if (isAudio) {
      return <audio controls src={media.url} className='w-full' />;
    }
    if (isPdf) {
      return (
        <a
          href={media.url}
          target='_blank'
          rel='noreferrer'
          className='text-purple-heart-700 truncate'
        >
          {media.name ?? t('courses.builder.blocks.openPdf')}
        </a>
      );
    }
    return (
      <img
        src={media.url}
        alt={media.name ?? ''}
        className='max-h-[420px] w-full rounded-xl object-cover'
      />
    );
  }

  if (hasMedia && isTeacherView) {
    return (
      <div className='space-y-3'>
        {isVideo ? (
          <VideoPlayer url={media.url} name={media.name} />
        ) : isAudio ? (
          <audio controls src={media.url} className='w-full' />
        ) : isPdf ? (
          <a
            href={media.url}
            target='_blank'
            rel='noreferrer'
            className='text-purple-heart-700'
          >
            {media.name ?? t('courses.builder.blocks.openPdf')}
          </a>
        ) : (
          <img
            src={media.url}
            alt=''
            className='max-h-[420px] w-full rounded-xl object-cover'
          />
        )}
        <div className='flex gap-2'>
          <Button variant='outline' onClick={() => setUrl('')}>
            {t('courses.builder.blocks.changeMedia')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      <button
        type='button'
        onClick={() => fileRef.current?.click()}
        className={cn(
          'flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-700 bg-neutral-900 p-6 text-white',
        )}
      >
        <CloudUpload className='size-10 text-purple-heart-300' />
        <p className='text-sm'>{t('courses.builder.blocks.uploadFromDevice')}</p>
        <span className='rounded-lg bg-purple-heart-700 px-4 py-2 text-sm'>
          {t('courses.builder.blocks.uploadAction')}
        </span>
        <input
          ref={fileRef}
          type='file'
          className='hidden'
          accept={
            isVideo ? 'video/*' : isAudio ? 'audio/*' : isPdf ? '.pdf' : 'image/*'
          }
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFile(file);
          }}
        />
      </button>

      <div className='flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-700 bg-neutral-900 p-6 text-white'>
        {isVideo ? (
          <Film className='size-10 text-purple-heart-300' />
        ) : isPdf ? (
          <Link2 className='size-10 text-purple-heart-300' />
        ) : (
          <ImagePlus className='size-10 text-purple-heart-300' />
        )}
        <Input
          dir='ltr'
          placeholder={
            isVideo
              ? 'https://youtube.com/watch?v=…'
              : 'https://'
          }
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          className='h-11 rounded-lg border-neutral-600 bg-neutral-800 text-white'
          onKeyDown={(e) => {
            if (e.key === 'Enter' && urlDraft.trim()) {
              setUrl(urlDraft.trim());
            }
          }}
        />
        <Button
          className='rounded-lg bg-purple-heart-700 hover:bg-purple-heart-600'
          onClick={() => {
            if (urlDraft.trim()) setUrl(urlDraft.trim());
          }}
        >
          {t('courses.builder.blocks.addLink')}
        </Button>
      </div>
    </div>
  );
};
