import { redirect } from "next/navigation";
import { getBrokerInfo, getPropertyById } from "@/lib/actions/property";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PropertyAdPage({ params }: Props) {
  const { id } = await params;

  // Clean ID - extract UUID if present in the string
  const cleanId =
    id.match(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
    )?.[0] || id;

  const property = await getPropertyById(cleanId);

  if (!property) {
    redirect("/");
  }

  // Redirect based on status
  if (property.status === "FOR_RENT") {
    redirect(`/rental/${cleanId}`);
  }

  // Check if it's a broker property
  const broker = await getBrokerInfo(property.userId);
  if (broker) {
    redirect(`/broker/property/${cleanId}`);
  }

  // Default to property details
  redirect(`/property/${cleanId}`);
}
