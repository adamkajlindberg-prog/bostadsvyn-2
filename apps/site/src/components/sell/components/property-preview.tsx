"use client";

import type { Property } from "db";
import dynamic from "next/dynamic";
import { memo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for PropertyCard while it loads.
 * Matches the approximate dimensions of the property card.
 */
function PropertyCardSkeleton() {
  return (
    <div className="w-full rounded-lg border bg-card overflow-hidden">
      <div className="flex flex-col sm:flex-row h-full">
        {/* Image skeleton */}
        <div className="sm:w-[50%] shrink-0">
          <Skeleton className="aspect-video w-full" />
        </div>
        {/* Content skeleton */}
        <div className="sm:w-[50%] p-4 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-1/3" />
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Dynamically imported PropertyCard with SSR disabled.
 * This prevents hydration mismatches when using mock data with dates.
 */
const PropertyCard = dynamic(() => import("@/components/property-card"), {
  ssr: false,
  loading: () => <PropertyCardSkeleton />,
});

interface PropertyPreviewProps {
  property: Property;
  size?: "small" | "medium" | "large";
}

/**
 * Memoized property preview component for the sell page.
 * Uses dynamic import with SSR disabled to prevent hydration issues.
 * Wrapped in React.memo to prevent unnecessary re-renders.
 */
export const PropertyPreview = memo(function PropertyPreview({
  property,
  size,
}: PropertyPreviewProps) {
  return <PropertyCard property={property} size={size} disableClick />;
});
