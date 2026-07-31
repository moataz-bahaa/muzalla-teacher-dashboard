import type { HTMLAttributes } from 'react'
import { Children } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDrawerAction } from './context'

interface IDrawerContentProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: string | React.ReactNode
}

const DrawerContent: React.FC<IDrawerContentProps> = ({
  title,
  className,
  children,
  ...props
}) => {
  const { closeDrawer } = useDrawerAction()
  const childrenArray = Children.toArray(children)
  const firstChild = childrenArray[0]
  const restChilds = childrenArray.slice(1)

  return (
    <div
      className={cn('flex h-screen w-full max-w-full flex-col bg-white', className)}
      {...props}
    >
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4">
        <button
          type="button"
          onClick={closeDrawer}
          className="flex size-10 items-center justify-center rounded-[10px] border border-neutral-200 bg-white"
          aria-label="Close"
        >
          <X className="size-5 text-neutral-700" />
        </button>
        {typeof title === 'string' ? (
          <h3 className="font-heading text-2xl font-bold text-purple-heart-950 sm:text-3xl">
            {title}
          </h3>
        ) : (
          title
        )}
      </div>
      {firstChild && (
        <div className="flex-grow overflow-y-auto px-4 py-4">{firstChild}</div>
      )}
      {restChilds.length > 0 && (
        <div className="border-t border-neutral-200 px-4 py-4">{restChilds}</div>
      )}
    </div>
  )
}

export default DrawerContent
