import NyproduktionDetail from "@/components/nyproduktion-detail";

type Props = {
  params: Promise<{ projectId: string }>;
};

export default async function NyproduktionDetailPage({ params }: Props) {
  const { projectId } = await params;

  return <NyproduktionDetail projectId={projectId} />;
}
