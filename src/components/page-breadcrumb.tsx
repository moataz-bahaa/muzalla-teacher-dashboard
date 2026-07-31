import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export interface IBreadcrumbItem {
  label: string
  to?: string
}

interface IPageBreadcrumbProps {
  items: IBreadcrumbItem[]
  className?: string
}

export const PageBreadcrumb: React.FC<IPageBreadcrumbProps> = ({ items, className }) => {
  return (
    <nav className={cn('flex flex-wrap items-center gap-2 text-sm text-neutral-500', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 && <span className="text-neutral-300">/</span>}
            {item.to && !isLast ? (
              <Link to={item.to} className="hover:text-purple-heart-700">
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast && 'font-medium text-neutral-800')}>{item.label}</span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
