import type { Property } from "db";
import PropertyCard from "@/components/property-card";
import type { PropertyGroup } from "../../utils/property-grouping";

interface PropertyListProps {
  groups: PropertyGroup[];
}

export const PropertyList = ({ groups }: PropertyListProps) => {
  return (
    <div className="mx-auto space-y-8">
      {groups.map((group) => (
        <div key={group.label} className="space-y-4">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 border-b">
            <h3 className="text-lg font-semibold text-foreground">
              {group.label}
            </h3>
          </div>
          <div className="space-y-6">
            {group.properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

