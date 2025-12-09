"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { MessagingCenterDesktop } from "./messaging-center-desktop";
import { MessagingCenterMobile } from "./messaging-center-mobile";

function LoadingState() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Laddar...</p>
        </div>
      </div>
    </div>
  );
}

export function MessagingCenter() {
  const isMobile = useIsMobile();

  // Show loading state while detecting device type
  if (isMobile === undefined) {
    return <LoadingState />;
  }

  return isMobile ? <MessagingCenterMobile /> : <MessagingCenterDesktop />;
}

export default MessagingCenter;
