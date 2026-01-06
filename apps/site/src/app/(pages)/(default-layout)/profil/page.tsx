import { redirect } from "next/navigation";
import { isServerAuthenticated } from "@/auth/server-session";

export default async function ProfilPage() {
  if (!(await isServerAuthenticated())) {
    redirect("/login");
  }

  redirect("/dashboard/profil");
}

