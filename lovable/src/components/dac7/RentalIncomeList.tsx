import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Calendar, DollarSign, Home } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RentalIncome {
  id: string;
  property_address: string;
  property_type: string;
  rental_income: number;
  reporting_period_start: string;
  reporting_period_end: string;
  rental_days: number;
  reported_to_skatteverket: boolean;
  reported_date: string | null;
}

interface RentalIncomeListProps {
  incomes: RentalIncome[];
}

const RentalIncomeList: React.FC<RentalIncomeListProps> = ({ incomes }) => {
  const getPropertyTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      apartment: "Lägenhet",
      house: "Villa",
      vacation_home: "Fritidshus",
      commercial: "Kommersiell",
    };
    return types[type] || type;
  };

  if (incomes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hyresintäkter</CardTitle>
          <CardDescription>Inga hyresintäkter registrerade än</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrerade hyresintäkter</CardTitle>
        <CardDescription>
          {incomes.length}{" "}
          {incomes.length === 1 ? "hyresintäkt" : "hyresintäkter"} registrerade
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {incomes.map((income) => (
          <div
            key={income.id}
            className="border rounded-lg p-4 space-y-3 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{income.property_address}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getPropertyTypeLabel(income.property_type)}
                </p>
              </div>
              <Badge
                variant={
                  income.reported_to_skatteverket ? "default" : "secondary"
                }
              >
                {income.reported_to_skatteverket
                  ? "Rapporterad"
                  : "Ej rapporterad"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {income.rental_income.toLocaleString("sv-SE")} SEK
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{income.rental_days} dagar</span>
              </div>
            </div>

            <div className="text-sm text-muted-foreground pt-2 border-t">
              Period:{" "}
              {format(new Date(income.reporting_period_start), "P", {
                locale: sv,
              })}{" "}
              -{" "}
              {format(new Date(income.reporting_period_end), "P", {
                locale: sv,
              })}
            </div>

            {income.reported_to_skatteverket && income.reported_date && (
              <div className="text-xs text-muted-foreground pt-1">
                Rapporterad:{" "}
                {format(new Date(income.reported_date), "PPP", { locale: sv })}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RentalIncomeList;
