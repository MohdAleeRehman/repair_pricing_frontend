
import { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  id?: string;
}

const PromptInput = ({ 
  onSubmit, 
  placeholder = "Describe your phone issue...", 
  className,
  autoFocus = false,
  id
}: PromptInputProps) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };
  
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);
  
  useEffect(() => {
    adjustTextareaHeight();
  }, [value]);
  
  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  return (
    <div className={cn(
      'relative border border-gray-300 rounded-lg overflow-hidden bg-white shadow-md',
      className
    )}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        id={id}
        className="resize-none w-full px-4 py-3 pr-12 focus:outline-none text-lg"
      />
      <button
        onClick={handleSubmit}
        disabled={!value.trim()}
        className={cn(
          'absolute right-3 bottom-3 p-2 rounded-lg transition-all',
          value.trim() 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'bg-gray-200 text-gray-400'
        )}
        aria-label="Submit"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
};

export default PromptInput;
