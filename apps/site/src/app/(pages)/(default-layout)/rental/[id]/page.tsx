import { notFound, redirect } from "next/navigation";
import RentalDetails from "@/components/rental-details";
import { getPropertyById, getPropertyOwner } from "@/lib/actions/property";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RentalPage({ params }: Props) {
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

  // Verify it's a rental property
  if (property.status !== "FOR_RENT") {
    redirect(`/annons/${cleanId}`);
  }

  // Fetch owner info
  const owner = await getPropertyOwner(property.userId);

  return (
    <RentalDetails property={property} propertyOwner={owner || undefined} />
  );
}
