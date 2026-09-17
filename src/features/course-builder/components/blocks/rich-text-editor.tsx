import { cn } from '@/lib/utils';
import {
  Bold,
  ChevronDown,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Underline as UnderlineIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const FONT_SIZES = [14, 16, 18, 20, 24, 28, 32] as const;

export interface IRichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  contentClassName?: string;
  editable?: boolean;
  dir?: 'rtl' | 'ltr';
}

const runCommand = (command: string, value?: string) => {
  document.execCommand(command, false, value);
};

const isEditorEmpty = (html: string) => {
  const text = html
    .replace(/<br\s*\/?>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .trim();
  return text.length === 0;
};

export const RichTextEditor: React.FC<IRichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'اكتب النص هنا...',
  className,
  contentClassName,
  editable = true,
  dir = 'rtl',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState<number>(18);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [activeMarks, setActiveMarks] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
  });
  const [focused, setFocused] = useState(false);
  const [empty, setEmpty] = useState(() => isEditorEmpty(value));

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (el.innerHTML !== value) {
      el.innerHTML = value || '';
    }
    setEmpty(isEditorEmpty(value));
  }, [value]);

  const syncMarks = () => {
    setActiveMarks({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strike: document.queryCommandState('strikeThrough'),
    });
  };

  const emitChange = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    setEmpty(isEditorEmpty(html));
    onChange(html);
    syncMarks();
  };

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const applyFontSize = (size: number) => {
    setFontSize(size);
    focusEditor();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      document.execCommand('fontSize', false, '7');
      const fonts = editorRef.current?.querySelectorAll('font[size="7"]');
      fonts?.forEach((font) => {
        const span = document.createElement('span');
        span.style.fontSize = `${size}px`;
        span.innerHTML = font.innerHTML || '\u200b';
        font.replaceWith(span);
      });
    } else {
      const span = document.createElement('span');
      span.style.fontSize = `${size}px`;
      span.appendChild(range.extractContents());
      range.insertNode(span);
      selection.removeAllRanges();
      const next = document.createRange();
      next.selectNodeContents(span);
      selection.addRange(next);
    }
    emitChange();
    setShowSizeMenu(false);
  };

  const setLink = () => {
    focusEditor();
    const previous = document.queryCommandValue('createLink');
    const url = window.prompt('الرابط', previous || 'https://');
    if (url === null) return;
    if (!url) {
      runCommand('unlink');
    } else {
      runCommand('createLink', url);
    }
    emitChange();
  };

  if (!editable) {
    return (
      <div
        dir={dir}
        className={cn(
          'text-neutral-700',
          '[&_ul]:list-none [&_ul]:space-y-4 [&_ul_li]:relative [&_ul_li]:pe-5',
          '[&_ul_li]:before:absolute [&_ul_li]:before:end-0 [&_ul_li]:before:top-2 [&_ul_li]:before:size-2 [&_ul_li]:before:rounded-full [&_ul_li]:before:bg-purple-heart-900 [&_ul_li]:before:content-[""]',
          '[&_ol]:list-decimal [&_ol]:space-y-4 [&_ol]:ps-0 [&_ol]:pe-8 [&_ol_li]:marker:font-bold [&_ol_li]:marker:text-purple-heart-900',
          contentClassName,
        )}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    );
  }

  const toolbarButtonClass = (active: boolean) =>
    cn(
      'flex size-8 items-center justify-center rounded-full transition-all duration-150',
      active
        ? 'bg-purple-heart-100 text-purple-heart-900'
        : 'text-neutral-600 hover:bg-neutral-100',
    );

  const showToolbar = focused || Boolean(value && !empty);

  return (
    <div className={cn('relative', className)}>
      {showToolbar && (
        <div className='absolute -top-13 start-0 z-20 animate-in fade-in-0 zoom-in-95 duration-150'>
          <div className='flex items-center gap-0.5 rounded-md border border-white bg-white p-2 shadow-[0_4px_4px_rgba(0,0,0,0.15)]'>
            <div className='relative'>
              <button
                type='button'
                className='flex h-[25px] w-[60px] items-center justify-between rounded-lg border border-neutral-200 px-1.5 text-sm text-neutral-700'
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowSizeMenu((prev) => !prev)}
              >
                <ChevronDown className='size-4' />
                <span>{fontSize}</span>
              </button>
              {showSizeMenu && (
                <div className='absolute top-[calc(100%+4px)] start-0 z-30 min-w-[60px] overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg animate-in fade-in-0 zoom-in-95'>
                  {FONT_SIZES.map((size) => (
                    <button
                      key={size}
                      type='button'
                      className={cn(
                        'flex w-full px-2 py-1.5 text-sm hover:bg-purple-heart-50',
                        fontSize === size &&
                          'bg-purple-heart-100 text-purple-heart-900',
                      )}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyFontSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type='button'
              className={toolbarButtonClass(activeMarks.bold)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                focusEditor();
                runCommand('bold');
                emitChange();
              }}
            >
              <Bold className='size-[18px]' />
            </button>
            <button
              type='button'
              className={toolbarButtonClass(activeMarks.italic)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                focusEditor();
                runCommand('italic');
                emitChange();
              }}
            >
              <Italic className='size-[18px]' />
            </button>
            <button
              type='button'
              className={toolbarButtonClass(activeMarks.underline)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                focusEditor();
                runCommand('underline');
                emitChange();
              }}
            >
              <UnderlineIcon className='size-[18px]' />
            </button>
            <button
              type='button'
              className={toolbarButtonClass(activeMarks.strike)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                focusEditor();
                runCommand('strikeThrough');
                emitChange();
              }}
            >
              <Strikethrough className='size-[18px]' />
            </button>
            <button
              type='button'
              className={toolbarButtonClass(false)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={setLink}
            >
              <Link2 className='size-[18px]' />
            </button>
            <button
              type='button'
              className={toolbarButtonClass(false)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                focusEditor();
                runCommand('insertOrderedList');
                emitChange();
              }}
            >
              <ListOrdered className='size-[18px]' />
            </button>
            <button
              type='button'
              className={toolbarButtonClass(false)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                focusEditor();
                runCommand('insertUnorderedList');
                emitChange();
              }}
            >
              <List className='size-[18px]' />
            </button>
            <button
              type='button'
              className={toolbarButtonClass(false)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                focusEditor();
                runCommand('formatBlock', 'blockquote');
                emitChange();
              }}
            >
              <Quote className='size-[18px]' />
            </button>
          </div>
        </div>
      )}

      <div
        className={cn(
          'relative rounded border border-purple-heart-500 p-2.5 transition-shadow duration-200',
          focused && 'shadow-[0_0_0_1px_rgba(139,112,255,0.35)]',
        )}
      >
        {empty && (
          <span className='pointer-events-none absolute inset-2.5 text-end text-neutral-400'>
            {placeholder}
          </span>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          dir={dir}
          className={cn(
            'relative min-h-[88px] w-full text-end text-[18px] leading-[29px] text-neutral-700 outline-none',
            '[&_ul]:list-none [&_ul]:space-y-4 [&_ul_li]:relative [&_ul_li]:pe-5',
            '[&_ul_li]:before:absolute [&_ul_li]:before:end-0 [&_ul_li]:before:top-2 [&_ul_li]:before:size-2 [&_ul_li]:before:rounded-full [&_ul_li]:before:bg-purple-heart-900 [&_ul_li]:before:content-[""]',
            '[&_ol]:list-decimal [&_ol]:space-y-4 [&_ol]:ps-0 [&_ol]:pe-8 [&_ol_li]:marker:font-bold [&_ol_li]:marker:text-purple-heart-900',
            '[&_blockquote]:border-s-4 [&_blockquote]:border-purple-heart-500 [&_blockquote]:ps-4 [&_blockquote]:italic',
            '[&_a]:text-purple-heart-700 [&_a]:underline',
            contentClassName,
          )}
          onInput={emitChange}
          onBlur={() => {
            setFocused(false);
            setShowSizeMenu(false);
            emitChange();
          }}
          onFocus={() => {
            setFocused(true);
            syncMarks();
          }}
          onKeyUp={syncMarks}
          onMouseUp={syncMarks}
        />
      </div>
    </div>
  );
};
