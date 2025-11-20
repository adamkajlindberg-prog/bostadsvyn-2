import { redirect } from "next/navigation";
import { isServerAuthenticated } from "@/auth/server-session";
import PropertyManagement from "@/components/property-management";

export default async function PropertyManagementPage() {
  if (!(await isServerAuthenticated())) {
    redirect("/login");
  }

  return <PropertyManagement />;
}
