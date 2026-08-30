import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { forwardRef } from 'react';
import { Input } from '../ui/form/input';

interface ISearchInputProps extends React.ComponentProps<typeof Input> {
  containerClassName?: string;
}

const SearchInput = forwardRef<HTMLInputElement, ISearchInputProps>(
  ({ containerClassName, ...props }, ref) => {
    return (
      <div className={cn('relative min-w-60 ', containerClassName)}>
        <Search className='pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400' />
        <Input
          className='h-11 rounded-lg ps-10 bg-white'
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
