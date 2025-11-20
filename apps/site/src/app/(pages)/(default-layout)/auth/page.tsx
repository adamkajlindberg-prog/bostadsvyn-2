import { redirect } from "next/navigation";
import { isServerAuthenticated } from "@/auth/server-session";
import { LoginForm } from "@/components/login-form";

export default async function AuthPage() {
  if (await isServerAuthenticated()) {
    redirect("/");
  }
  return <LoginForm />;
}
