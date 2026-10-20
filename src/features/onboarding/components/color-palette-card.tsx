import { cn } from '@/lib/utils'
import type { IColorPalette } from '../types'

interface IColorPaletteCardProps {
  palette: IColorPalette
  selected?: boolean
  onClick?: () => void
}

export const ColorPaletteCard: React.FC<IColorPaletteCardProps> = ({
  palette,
  selected = false,
  onClick,
}) => {
  const [primary, secondary, accent] = palette.colors

  return (
    <button
      type='button'
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'flex h-[66px] w-full items-center justify-between gap-4 rounded-xl border-2 p-4 transition-colors',
        selected
          ? 'border-purple-heart-700 bg-purple-heart-100'
          : 'border-neutral-200 bg-neutral-100 hover:border-neutral-300',
      )}
    >
      <span
        className={cn(
          'size-4 shrink-0 rounded-full border-2',
          selected
            ? 'border-purple-heart-700 bg-purple-heart-700'
            : 'border-neutral-300 bg-white',
        )}
      />
      <span className='flex h-11 flex-1 overflow-hidden rounded-lg'>
        <span className='h-full flex-[2]' style={{ backgroundColor: primary }} />
        <span
          className='h-full flex-[2]'
          style={{ backgroundColor: secondary }}
        />
        <span className='h-full flex-1' style={{ backgroundColor: accent }} />
      </span>
    </button>
  )
}
