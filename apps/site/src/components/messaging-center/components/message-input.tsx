"use client";

import { Send } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageInputProps {
  onSend: (message: string) => Promise<boolean>;
  disabled?: boolean;
  sending?: boolean;
}

export const MessageInput = memo(function MessageInput({
  onSend,
  disabled = false,
  sending = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = useCallback(async () => {
    if (!message.trim() || disabled || sending) return;

    const success = await onSend(message);
    if (success) {
      setMessage("");
    }
  }, [message, disabled, sending, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <div className="border-t p-3 sm:p-4 shrink-0">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            placeholder="Skriv ett meddelande..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || sending}
            className="min-h-[40px]"
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!message.trim() || disabled || sending}
          size="icon"
          className="shrink-0"
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Skicka meddelande</span>
        </Button>
      </div>
    </div>
  );
});
