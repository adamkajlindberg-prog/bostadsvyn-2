import { redirect } from "next/navigation";
import { isServerAuthenticated } from "@/auth/server-session";
import Profile from "@/components/profile";

export default async function ProfilePage() {
  if (!(await isServerAuthenticated())) {
    redirect("/login");
  }

  return <Profile />;
}
