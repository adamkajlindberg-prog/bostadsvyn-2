import React, { useEffect, useRef } from 'react';

interface LiveRegionProps {
  message: string;
  priority?: 'polite' | 'assertive';
  clearAfter?: number;
}

/**
 * LiveRegion component announces dynamic content changes to screen readers
 * without interrupting the user's current flow (WCAG 4.1.3 - Status Messages).
 * 
 * @param message - The message to announce
 * @param priority - 'polite' (default) waits for speech to finish, 'assertive' interrupts
 * @param clearAfter - Auto-clear the message after X milliseconds (default: 5000)
 */
const LiveRegion: React.FC<LiveRegionProps> = ({ 
  message, 
  priority = 'polite',
  clearAfter = 5000 
}) => {
  const [currentMessage, setCurrentMessage] = React.useState(message);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setCurrentMessage(message);

    if (clearAfter > 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setCurrentMessage('');
      }, clearAfter);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message, clearAfter]);

  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {currentMessage}
    </div>
  );
};

export default LiveRegion;
