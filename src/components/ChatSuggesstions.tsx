// components/ChatSuggestions.tsx
import { Button } from "@/components/ui/button";

const ChatSuggestions = ({
  options,
  onSelect,
}: {
  options: string[];
  onSelect: (value: string) => void;
}) => (
  <div className="flex flex-wrap gap-2 mt-2">
    {options.map((opt) => (
      <Button key={opt} variant="outline" onClick={() => onSelect(opt)}>
        {opt}
      </Button>
    ))}
  </div>
);

export default ChatSuggestions;
