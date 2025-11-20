import { redirect } from "next/navigation";
import { isServerAuthenticated } from "@/auth/server-session";
import CreateRental from "@/components/create-rental";

export default async function CreateRentalPage() {
  if (!(await isServerAuthenticated())) {
    redirect("/login");
  }

  return <CreateRental />;
}
