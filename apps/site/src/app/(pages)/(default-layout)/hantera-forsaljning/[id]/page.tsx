import { redirect } from "next/navigation";
import { isServerAuthenticated } from "@/auth/server-session";
import SalesAdManagement from "@/components/sales-ad-management";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SalesAdManagementPage({ params }: Props) {
  if (!(await isServerAuthenticated())) {
    redirect("/login");
  }

  const { id } = await params;

  return <SalesAdManagement id={id} />;
}
