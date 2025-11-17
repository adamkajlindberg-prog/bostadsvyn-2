import { CircleAlertIcon, MapPinIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Area = () => {
  return (
    <Card className="py-6 shadow-xs">
      <CardContent className="px-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPinIcon className="h-5 w-5 @lg:h-6 @lg:w-6" />
          <div className="text-xl @lg:text-2xl font-semibold tracking-tight">
            Område
          </div>
        </div>

        <div className="p-3.5 rounded-md border border-primary-light mb-4">
          <div className="flex items-center gap-2 text-primary-light text-xs @lg:text-sm">
            <CircleAlertIcon size={16} />
            Kunde inte hitta adressen på kartan
          </div>
        </div>

        <div className="text-sm text-muted-foreground font-medium mb-0.5">
          Adress:
        </div>
        <div className="text-sm text-muted-foreground mb-0.5">
          Strandvägen 42
        </div>
        <div className="text-sm text-muted-foreground mb-0.5">
          182 68 Djursholm
        </div>
      </CardContent>
    </Card>
  );
};

export default Area;
