"use client";

import { Loader2Icon, MapPinIcon } from "lucide-react";

const CommercialMap = () => {
  return (
    <div className="h-[480px] rounded-xl border bg-card flex items-center justify-center mb-8">
      <div className="text-center">
        <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <MapPinIcon className="h-8 w-8 text-primary" />
        </div>
        <p className="text-muted-foreground">
          Karta över kommersiella fastigheter
        </p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Kommer snart...
        </p>
      </div>
    </div>
  );
};

export default CommercialMap;
