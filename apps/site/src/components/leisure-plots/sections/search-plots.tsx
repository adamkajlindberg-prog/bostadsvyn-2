import { CompassIcon, FunnelIcon, MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectOption = {
  value: string;
  label: string;
};

const PROPERTY_TYPES: SelectOption[] = [
  { value: "holiday-house", label: "Fritidshus" },
  { value: "plot", label: "Tomt" },
  { value: "cabin", label: "Stuga" },
  { value: "farm", label: "Gård" },
];

const ENVIRONMENTS: SelectOption[] = [
  { value: "coastal", label: "Havsnära" },
  { value: "forest", label: "Skog" },
  { value: "mountain", label: "Fjäll" },
  { value: "lakeside", label: "Sjönära" },
];

const PRICE_RANGES: SelectOption[] = [
  { value: "under-500k", label: "Under 500k" },
  { value: "500k-1m", label: "500k - 1M" },
  { value: "1m-2m", label: "1M - 2M" },
  { value: "over-2m", label: "Över 2M" },
];

type SelectFieldProps = {
  label: string;
  placeholder: string;
  options: SelectOption[];
};

const SelectField = ({ label, placeholder, options }: SelectFieldProps) => (
  <div>
    <Label className="text-sm font-medium mb-2">{label}</Label>
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
);

const SearchPlots = () => (
  <Card className="py-6 shadow-xs mb-8">
    <CardContent className="px-6">
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <FunnelIcon size={20} />
        <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight">
          Sök fritidsbostad eller tomt
        </h3>
      </div>

      <div className="grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-4 gap-4 mb-7">
        <div>
          <Label className="text-sm font-medium mb-2">Område</Label>
          <Input
            type="text"
            className="text-sm"
            placeholder="Skärgård, Småland, Dalarna..."
          />
        </div>

        <SelectField
          label="Typ"
          placeholder="Välj typ"
          options={PROPERTY_TYPES}
        />
        <SelectField
          label="Miljö"
          placeholder="Välj miljö"
          options={ENVIRONMENTS}
        />
        <SelectField
          label="Prisintervall"
          placeholder="Välj pris"
          options={PRICE_RANGES}
        />
      </div>

      <div className="flex flex-col @lg:flex-row gap-4">
        <Button size="lg">
          <CompassIcon />
          Sök fastigheter
        </Button>

        <Button size="lg" variant="outline">
          <MapPinIcon />
          Visa på karta
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default SearchPlots;
