import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-3 justify-start animate-fade-in">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="bg-primary text-primary-foreground">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 max-w-[85%]">
        <div className="rounded-lg p-4 bg-muted">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce mr-1" 
                   style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce mr-1" 
                   style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" 
                   style={{ animationDelay: '300ms' }}></div>
            </div>
            <span>AI:n analyserar och hämtar aktuell data{dots}</span>
          </div>
        </div>
      </div>
    </div>
  );
}