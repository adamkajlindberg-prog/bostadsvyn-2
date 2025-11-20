import RentalDetails from "@/components/rental-details";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RentalPage({ params }: Props) {
  const { id } = await params;

  return <RentalDetails id={id} />;
}
