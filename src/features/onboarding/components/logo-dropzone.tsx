import { cn } from '@/lib/utils'
import { ImagePlus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ILogoDropzoneProps {
  file: File | null
  onChange: (file: File | null) => void
  className?: string
}

export const LogoDropzone: React.FC<ILogoDropzoneProps> = ({
  file,
  onChange,
  className,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const handleFiles = (files: FileList | null) => {
    const next = files?.[0]
    if (!next) return
    if (next.size > 50 * 1024 * 1024) return
    onChange(next)
  }

  return (
    <button
      type='button'
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault()
        setIsDragging(false)
        handleFiles(event.dataTransfer.files)
      }}
      className={cn(
        'flex h-[227px] w-full max-w-[459px] flex-col items-center justify-center gap-5 rounded-xl border border-dashed border-purple-heart-700 bg-purple-heart-100 p-12 text-center transition-colors',
        isDragging && 'bg-purple-heart-50',
        className,
      )}
    >
      {previewUrl ? (
        <img
          src={previewUrl}
          alt={file?.name ?? 'Logo preview'}
          className='max-h-28 max-w-full rounded-lg object-contain'
        />
      ) : (
        <>
          <span className='flex size-14 items-center justify-center rounded-xl bg-white text-purple-heart-700 shadow-sm'>
            <ImagePlus className='size-7' />
          </span>
          <div className='space-y-1'>
            <p className='text-base font-medium text-purple-heart-700'>
              {t('onboarding.branding.uploadTitle')}
            </p>
            <p className='text-sm text-purple-heart-950'>
              {t('onboarding.branding.uploadHint')}
            </p>
          </div>
          <p className='text-sm text-purple-heart-950'>
            {t('onboarding.branding.maxSize')}
          </p>
        </>
      )}
      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        className='sr-only'
        onChange={(event) => handleFiles(event.target.files)}
      />
    </button>
  )
}
