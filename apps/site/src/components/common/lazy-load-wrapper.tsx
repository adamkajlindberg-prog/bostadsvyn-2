"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LazyLoadWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  minHeight?: number;
  className?: string;
}

/**
 * LazyLoadWrapper component that defers rendering of children until they are about to enter the viewport.
 * Uses IntersectionObserver for efficient lazy loading.
 *
 * @param children - Content to render when visible
 * @param fallback - Optional custom fallback while loading (defaults to skeleton)
 * @param rootMargin - Margin around the root (default: "100px" to preload slightly before visible)
 * @param threshold - Intersection threshold (default: 0.1)
 * @param minHeight - Minimum height placeholder to prevent layout shift (default: 200)
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <LazyLoadWrapper minHeight={400}>
 *   <ExpensiveComponent />
 * </LazyLoadWrapper>
 * ```
 */
const LazyLoadWrapper = ({
  children,
  fallback,
  rootMargin = "100px",
  threshold = 0.1,
  minHeight = 200,
  className = "",
}: LazyLoadWrapperProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin,
        threshold,
      },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [rootMargin, threshold, hasLoaded]);

  const defaultFallback = (
    <div className="space-y-4 p-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-32 w-full" />
      <div className="flex gap-4">
        <Skeleton className="h-20 w-20 rounded" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={ref}
      className={className}
      style={{ minHeight: isVisible ? "auto" : `${minHeight}px` }}
    >
      {isVisible ? children : fallback || defaultFallback}
    </div>
  );
};

export default LazyLoadWrapper;

/**
 * Higher-order component for lazy loading any component
 *
 * @example
 * ```tsx
 * const LazyExpensiveComponent = withLazyLoading(ExpensiveComponent, {
 *   minHeight: 400,
 * });
 * ```
 */
export function withLazyLoading<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<LazyLoadWrapperProps, "children">,
) {
  return function LazyLoadedComponent(props: P) {
    return (
      <LazyLoadWrapper {...options}>
        <Component {...props} />
      </LazyLoadWrapper>
    );
  };
}

/**
 * Custom hook for intersection observer functionality
 *
 * @param ref - Reference to the element to observe
 * @param options - IntersectionObserver options
 * @returns Object containing isIntersecting and hasIntersected states
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const { isIntersecting, hasIntersected } = useIntersectionObserver(ref);
 *
 * return (
 *   <div ref={ref}>
 *     {hasIntersected && <ExpensiveContent />}
 *   </div>
 * );
 * ```
 */
export function useIntersectionObserver(
  ref: RefObject<Element | null>,
  options: IntersectionObserverInit = {},
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, hasIntersected, options]);

  return { isIntersecting, hasIntersected };
}
