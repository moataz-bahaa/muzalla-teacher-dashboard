import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form/input';
import { cn } from '@/lib/utils';
import type { IPageBlock } from '@/types/page-block';
import { EBlockType } from '@/types/page-block';
import { CloudUpload, ExternalLink, Film, FileText, ImagePlus, Link2 } from 'lucide-react';
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

const PdfViewer: React.FC<{
  url: string;
  name?: string;
  openLabel: string;
}> = ({ url, name, openLabel }) => {
  const displayName = name || url;
  return (
    <div className='min-w-0 space-y-3 overflow-hidden'>
      <div className='min-w-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50'>
        <iframe
          src={url}
          title={displayName}
          className='block h-[420px] w-full max-w-full border-0'
        />
      </div>
      <a
        href={url}
        target='_blank'
        rel='noreferrer'
        className='flex min-w-0 items-center gap-2 text-sm text-purple-heart-700'
      >
        <ExternalLink className='size-4 shrink-0' />
        <span className='min-w-0 truncate' title={displayName}>
          {displayName || openLabel}
        </span>
      </a>
    </div>
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
        <PdfViewer
          url={media.url}
          name={media.name}
          openLabel={t('courses.builder.blocks.openPdf')}
        />
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
      <div className='min-w-0 space-y-3 overflow-hidden'>
        {isVideo ? (
          <VideoPlayer url={media.url} name={media.name} />
        ) : isAudio ? (
          <audio controls src={media.url} className='w-full' />
        ) : isPdf ? (
          <PdfViewer
            url={media.url}
            name={media.name}
            openLabel={t('courses.builder.blocks.openPdf')}
          />
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
        {isPdf ? (
          <FileText className='size-10 text-purple-heart-300' />
        ) : (
          <CloudUpload className='size-10 text-purple-heart-300' />
        )}
        <p className='text-center text-sm'>
          {t('courses.builder.blocks.uploadFromDevice')}
        </p>
        <span className='rounded-lg bg-purple-heart-700 px-4 py-2 text-sm'>
          {t('courses.builder.blocks.uploadAction')}
        </span>
        <input
          ref={fileRef}
          type='file'
          className='hidden'
          accept={
            isVideo ? 'video/*' : isAudio ? 'audio/*' : isPdf ? '.pdf,application/pdf' : 'image/*'
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
              ? t('courses.builder.blocks.youtubeUrlPlaceholder')
              : isPdf
                ? t('courses.builder.blocks.pdfUrlPlaceholder')
                : t('courses.builder.blocks.urlPlaceholder')
          }
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          className='h-11 w-full min-w-0 rounded-lg border-neutral-600 bg-neutral-800 text-white'
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
