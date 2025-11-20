import { redirect } from "next/navigation";
import { isServerAuthenticated } from "@/auth/server-session";
import AdManagement from "@/components/ad-management";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdManagementPage({ params }: Props) {
  if (!(await isServerAuthenticated())) {
    redirect("/login");
  }

  const { id } = await params;

  return <AdManagement id={id} />;
}
