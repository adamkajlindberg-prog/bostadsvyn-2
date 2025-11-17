import { useCallback, useState } from "react";

/**
 * Hook for announcing messages to screen readers using live regions
 * Useful for dynamic content updates and user feedback
 */
export const useAnnouncement = () => {
  const [announcement, setAnnouncement] = useState("");

  const announce = useCallback((message: string) => {
    // Clear first to ensure the same message can be announced twice
    setAnnouncement("");
    setTimeout(() => {
      setAnnouncement(message);
    }, 100);
  }, []);

  return { announcement, announce };
};
