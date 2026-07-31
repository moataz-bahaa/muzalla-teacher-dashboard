import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';
import { Children } from 'react';
import { useDrawerAction } from './context';
import { CloseButton } from '../ui/button';

interface IDrawerContentProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> {
  title: string | React.ReactNode;
}

const DrawerContent: React.FC<IDrawerContentProps> = ({
  title,
  className,
  children,
  ...props
}) => {
  const { closeDrawer } = useDrawerAction();
  const childrenArray = Children.toArray(children);
  const firstChild = childrenArray[0];
  const restChilds = childrenArray.slice(1);

  return (
    <div
      className={cn(
        'flex h-screen w-full max-w-full flex-col bg-white',
        className,
      )}
      {...props}
    >
      <div className='flex items-center justify-between border-b border-neutral-200 px-4 py-4'>
        {typeof title === 'string' ? (
          <h3 className='font-heading text-2xl font-bold text-purple-heart-950 sm:text-3xl'>
            {title}
          </h3>
        ) : (
          title
        )}
        <CloseButton onClick={closeDrawer} />
      </div>
      {firstChild && (
        <div className='flex-grow overflow-y-auto px-4 py-4'>{firstChild}</div>
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
