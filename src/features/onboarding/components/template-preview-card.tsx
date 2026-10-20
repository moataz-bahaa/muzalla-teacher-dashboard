import { cn } from '@/lib/utils'
import type { TTemplateId } from '../types'

interface ITemplatePreviewCardProps {
  id: TTemplateId
  selected?: boolean
  onClick?: () => void
}

const TEMPLATE_STYLES: Record<
  TTemplateId,
  { accent: string; hero: string; label: string }
> = {
  'template-a': {
    accent: '#c45c26',
    hero: 'linear-gradient(135deg, #1a1a1a 0%, #3d2b1f 50%, #c45c26 100%)',
    label: 'A',
  },
  'template-b': {
    accent: '#2d6a4f',
    hero: 'linear-gradient(135deg, #081c15 0%, #1b4332 50%, #40916c 100%)',
    label: 'B',
  },
  'template-c': {
    accent: '#7c3aed',
    hero: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #7c3aed 100%)',
    label: 'C',
  },
}

export const TemplatePreviewCard: React.FC<ITemplatePreviewCardProps> = ({
  id,
  selected = false,
  onClick,
}) => {
  const style = TEMPLATE_STYLES[id]

  return (
    <button
      type='button'
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'group relative w-full max-w-[280px] overflow-hidden rounded-2xl border-2 bg-white shadow-md transition-all',
        selected
          ? 'border-purple-heart-700 ring-2 ring-purple-heart-300'
          : 'border-transparent hover:border-neutral-200',
      )}
    >
      <div
        className='relative h-[420px] w-full overflow-hidden'
        style={{ background: style.hero }}
      >
        <div className='absolute inset-x-0 top-0 flex h-8 items-center justify-between bg-black/40 px-3'>
          <span className='h-2 w-12 rounded bg-white/40' />
          <span className='flex gap-2'>
            <span className='h-2 w-8 rounded bg-white/30' />
            <span className='h-2 w-8 rounded bg-white/30' />
          </span>
        </div>
        <div className='absolute inset-x-6 top-16 space-y-3 text-start text-white'>
          <p className='text-lg font-bold leading-tight'>Site template {style.label}</p>
          <p className='text-xs text-white/70'>Preview layout for your educational platform</p>
          <span
            className='inline-flex rounded-md px-3 py-1.5 text-xs font-medium text-white'
            style={{ backgroundColor: style.accent }}
          >
            Explore
          </span>
        </div>
        <div className='absolute inset-x-4 bottom-4 grid grid-cols-2 gap-2'>
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className='h-16 rounded-lg bg-white/15 backdrop-blur-sm'
            />
          ))}
        </div>
      </div>
    </button>
  )
}
