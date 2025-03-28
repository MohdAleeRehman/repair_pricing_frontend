// components/ChatMessage.tsx
import { cn } from '@/lib/utils';

const ChatMessage = ({ message, isUser }: { message: string; isUser: boolean }) => (
  <div
    className={cn(
      'max-w-[75%] px-4 py-3 rounded-lg text-sm shadow',
      isUser
        ? 'bg-blue-600 text-white self-end'
        : 'bg-gray-100 text-gray-800 self-start'
    )}
  >
    {message}
  </div>
);

export default ChatMessage;
