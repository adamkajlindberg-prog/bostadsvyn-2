import { redirect } from "next/navigation";
import { isServerAuthenticated } from "@/auth/server-session";
import BrokerPortal from "@/components/broker-portal";

export default async function BrokerPortalPage() {
  if (!(await isServerAuthenticated())) {
    redirect("/maklare-login");
  }

  return <BrokerPortal />;
}
