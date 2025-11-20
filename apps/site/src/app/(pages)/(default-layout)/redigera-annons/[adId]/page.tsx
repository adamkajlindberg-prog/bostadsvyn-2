import { redirect } from "next/navigation";
import { isServerAuthenticated } from "@/auth/server-session";
import EditAd from "@/components/edit-ad";

type Props = {
  params: Promise<{ adId: string }>;
};

export default async function EditAdPage({ params }: Props) {
  if (!(await isServerAuthenticated())) {
    redirect("/login");
  }

  const { adId } = await params;

  return <EditAd adId={adId} />;
}
