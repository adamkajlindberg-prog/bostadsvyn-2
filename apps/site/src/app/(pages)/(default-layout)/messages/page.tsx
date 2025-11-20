import { redirect } from "next/navigation";
import { isServerAuthenticated } from "@/auth/server-session";
import MessagingCenter from "@/components/messaging-center";

export default async function MessagesPage() {
  if (!(await isServerAuthenticated())) {
    redirect("/login");
  }

  return <MessagingCenter />;
}
