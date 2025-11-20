import { redirect } from "next/navigation";
import { isServerAuthenticated } from "@/auth/server-session";
import EditRentalAd from "@/components/edit-rental-ad";

type Props = {
  params: Promise<{ adId: string }>;
};

export default async function EditRentalAdPage({ params }: Props) {
  if (!(await isServerAuthenticated())) {
    redirect("/login");
  }
  const { adId } = await params;

  return <EditRentalAd adId={adId} />;
}
