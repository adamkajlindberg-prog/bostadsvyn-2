"use client";

import { Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const MortgageCalculator = () => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Calculator className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Lånekalkylator</h3>
        <p className="text-muted-foreground">
          Funktionen för lånekalkylator kommer snart
        </p>
      </CardContent>
    </Card>
  );
};

export default MortgageCalculator;
