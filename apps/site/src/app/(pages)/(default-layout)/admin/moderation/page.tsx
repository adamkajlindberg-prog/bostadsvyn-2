import { redirect } from "next/navigation";
import { isServerRole } from "@/auth/server-session";
import AdminModeration from "@/components/admin-moderation";

export default async function AdminModerationPage() {
  if (!(await isServerRole(["admin"]))) {
    redirect("/login");
  }

  return <AdminModeration />;
}
