import { notFound } from "next/navigation";
import PropertyDetailsComponent from "@/components/property-details";
import {
  getBrokerInfo,
  getPropertyById,
  getPropertyOwner,
} from "@/lib/actions/property";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PropertyPage({ params }: Props) {
  const { id } = await params;

  // Clean ID - extract UUID if present in the string
  const cleanId =
    id.match(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
    )?.[0] || id;

  const property = await getPropertyById(cleanId);

  if (!property) {
    notFound();
  }

  // Fetch owner and broker info if property exists
  const [owner, broker] = await Promise.all([
    getPropertyOwner(property.userId),
    getBrokerInfo(property.userId),
  ]);

  return (
    <PropertyDetailsComponent
      property={property}
      propertyOwner={owner || undefined}
      brokerInfo={broker || undefined}
    />
  );
}
