import { Clock, MessageSquare, Star, ThumbsUp, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface MessageSummaryProps {
  message: {
    id: string;
    content: string;
    timestamp: Date;
    rating?: number;
    category?: string;
    followUpQuestions?: string[];
    reactions?: {
      thumbsUp: number;
      thumbsDown: number;
      heart: number;
    };
  };
  onQuickQuestion: (question: string) => void;
}

export default function MessageSummary({
  message,
  onQuickQuestion,
}: MessageSummaryProps) {
  const wordCount = message.content.split(" ").length;
  const isLongMessage = wordCount > 150;

  if (!isLongMessage) return null;

  return (
    <Card className="mt-4 bg-muted/30 border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Sammanfattning
            </span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {wordCount} ord
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          {message.category && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Kategori:</span>
              <Badge variant="outline" className="text-xs capitalize">
                {message.category}
              </Badge>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>
              Svarstid:{" "}
              {Date.now() - message.timestamp.getTime() < 10000
                ? "Snabb"
                : "Normal"}
            </span>
          </div>

          {message.rating && (
            <div className="flex items-center gap-2">
              <Star className="h-3 w-3 text-accent-gold" />
              <span>Betyg: {message.rating}/5</span>
            </div>
          )}

          {message.reactions &&
            (message.reactions.thumbsUp > 0 || message.reactions.heart > 0) && (
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-3 w-3 text-green-600" />
                <span>
                  Positiva reaktioner:{" "}
                  {message.reactions.thumbsUp + message.reactions.heart}
                </span>
              </div>
            )}
        </div>

        {message.followUpQuestions && message.followUpQuestions.length > 0 && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
            <MessageSquare className="h-3 w-3 text-primary" />
            <span className="text-xs text-muted-foreground">
              {message.followUpQuestions.length} fördjupningsfrågor tillgängliga
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
