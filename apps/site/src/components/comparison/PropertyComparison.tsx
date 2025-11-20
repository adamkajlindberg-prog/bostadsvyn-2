"use client";

import { BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PropertyComparison = () => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Fastighetsjämförelse</h3>
        <p className="text-muted-foreground">
          Funktionen för att jämföra fastigheter kommer snart
        </p>
      </CardContent>
    </Card>
  );
};

export default PropertyComparison;
