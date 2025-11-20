import { redirect } from "next/navigation";
import { isServerAuthenticated } from "@/auth/server-session";
import RentalAdManagement from "@/components/rental-ad-management";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RentalAdManagementPage({ params }: Props) {
  if (!(await isServerAuthenticated())) {
    redirect("/login");
  }

  const { id } = await params;

  return <RentalAdManagement id={id} />;
}
