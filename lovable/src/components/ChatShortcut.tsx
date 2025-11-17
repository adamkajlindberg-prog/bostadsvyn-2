import { MessageSquare } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ChatShortcutProps {
  onClick: () => void;
  variant?: "outline" | "default" | "ghost";
  className?: string;
  unreadCount?: number;
}

export const ChatShortcut: React.FC<ChatShortcutProps> = ({
  onClick,
  variant = "outline",
  className = "",
  unreadCount = 0,
}) => {
  return (
    <Button
      variant={variant}
      className={`relative w-full justify-start ${className}`}
      onClick={onClick}
    >
      <MessageSquare className="h-4 w-4 mr-2" />
      Meddelanden
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="ml-auto h-5 px-2 text-xs font-semibold"
        >
          {unreadCount}
        </Badge>
      )}
    </Button>
  );
};
