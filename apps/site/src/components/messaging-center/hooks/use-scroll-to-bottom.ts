"use client";

import { useCallback, useEffect, useRef } from "react";

interface UseScrollToBottomOptions {
  /** Trigger value that causes scroll when changed */
  trigger?: unknown;
  /** Scroll behavior */
  behavior?: ScrollBehavior;
}

export function useScrollToBottom(options: UseScrollToBottomOptions = {}) {
  const { trigger, behavior = "smooth" } = options;
  const ref = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    ref.current?.scrollIntoView({ behavior });
  }, [behavior]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: trigger is intentionally used to re-run the effect
  useEffect(() => {
    scrollToBottom();
  }, [trigger, scrollToBottom]);

  return { ref, scrollToBottom };
}
