import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/form/input';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useState } from 'react';

export interface ITagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const TagInput: React.FC<ITagInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
  const [input, setInput] = useState('');

  const addTag = () => {
    const next = input.trim();
    if (!next || value.includes(next)) return;
    onChange([...value, next]);
    setInput('');
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((item) => item !== tag));
  };

  return (
    <div
      className={cn(
        'flex min-h-12 flex-wrap items-center justify-end gap-2 rounded-lg border border-neutral-200 px-3 py-2',
        className,
      )}
    >
      {value.map((tag) => (
        <Badge
          key={tag}
          variant='secondary'
          className='h-auto cursor-pointer gap-1 rounded-full bg-success-100 px-2 py-0.5 text-xs font-medium text-success-800 hover:bg-success-200'
          asChild
        >
          <button type='button' onClick={() => removeTag(tag)}>
            {tag}
            <X className='size-3' />
          </button>
        </Badge>
      ))}
      <Input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            addTag();
          }
        }}
        placeholder={placeholder}
        className='h-8 min-w-[120px] flex-1 border-0 shadow-none focus-visible:ring-0'
      />
    </div>
  );
};
