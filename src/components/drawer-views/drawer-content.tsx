import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';
import { Children } from 'react';
import { CloseButton } from '../ui/button';
import { useDrawerAction } from './context';

interface IDrawerContentProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> {
  title?: string | React.ReactNode;
  applyGrow?: boolean;
}

const DrawerContent: React.FC<IDrawerContentProps> = ({
  title,
  className,
  children,
  applyGrow = true,
  ...props
}) => {
  const { closeDrawer } = useDrawerAction();
  const childrenArray = Children.toArray(children);
  const firstChild = childrenArray[0];
  const restChilds = childrenArray.slice(1);

  return (
    <div
      className={cn('flex h-screen max-w-full flex-col bg-white', className)}
      {...props}
    >
      <div className='flex items-center justify-between border-b border-neutral-200 px-4 py-4'>
        {title && typeof title === 'string' ? (
          <h3 className='font-heading font-bold text-purple-heart-950 text-6xl'>
            {title}
          </h3>
        ) : title ? (
          title
        ) : null}
        <CloseButton onClick={closeDrawer} />
      </div>
      {firstChild && (
        <div
          className={cn(
            'overflow-y-auto px-4 py-4',
            applyGrow ? 'flex-grow' : '',
          )}
        >
          {firstChild}
        </div>
      )}
      {restChilds.length > 0 && (
        <div className='border-t border-neutral-200 px-4 py-4'>
          {restChilds}
        </div>
      )}
    </div>
  );
};

export default DrawerContent;
