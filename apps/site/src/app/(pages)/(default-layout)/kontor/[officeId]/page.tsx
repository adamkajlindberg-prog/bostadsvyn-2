import OfficeProfile from "@/components/office-profile";

type Props = {
  params: Promise<{ officeId: string }>;
};

export default async function OfficeProfilePage({ params }: Props) {
  const { officeId } = await params;

  return <OfficeProfile officeId={officeId} />;
}
